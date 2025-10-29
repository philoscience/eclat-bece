import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Authenticated client to read the requester user
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const userId = userData.user.id;

    // Admin client to bypass RLS for provisioning
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Fetch role from auth metadata (set during signup)
    const { data: authUser, error: getAuthUserErr } = await admin.auth.admin.getUserById(userId);
    if (getAuthUserErr || !authUser?.user) {
      return new Response(JSON.stringify({ error: "Failed to fetch auth user" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const metaRole = (authUser.user.user_metadata?.role || "student") as
      | "student"
      | "parent"
      | "school";

    // Ensure user_roles entry exists (idempotent)
    const { error: roleUpsertErr } = await admin
      .from("user_roles")
      .upsert({ user_id: userId, role: metaRole }, { onConflict: "user_id,role" });

    if (roleUpsertErr) {
      console.error("provision-user: role upsert error", roleUpsertErr);
      return new Response(JSON.stringify({ error: "Failed to set role" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Create role-specific record if missing
    if (metaRole === "student") {
      const { data: exists } = await admin
        .from("students")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (!exists) {
        const { error } = await admin.from("students").insert({ user_id: userId });
        if (error) {
          console.warn("provision-user: create student record failed", error);
        }
      }
    } else if (metaRole === "parent") {
      const { data: exists } = await admin
        .from("parents")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (!exists) {
        const { error } = await admin.from("parents").insert({ user_id: userId });
        if (error) {
          console.warn("provision-user: create parent record failed", error);
        }
      }
    } else if (metaRole === "school") {
      const { data: exists } = await admin
        .from("schools")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (!exists) {
        const { error } = await admin.from("schools").insert({ user_id: userId });
        if (error) {
          console.warn("provision-user: create school record failed", error);
        }
      }
    }

    return new Response(JSON.stringify({ ok: true, role: metaRole }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("provision-user error", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});