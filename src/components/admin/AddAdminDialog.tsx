import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    isSuperAdmin: z.boolean().default(false),
});

interface AddAdminDialogProps {
    onSuccess: () => void;
}

export function AddAdminDialog({ onSuccess }: AddAdminDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            fullName: "",
            isSuperAdmin: false,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user) return;
        setLoading(true);

        try {
            // 1. Find the user by email
            const { data: profiles, error: profileError } = await supabase
                .from("profiles")
                .select("id, email")
                .eq("email", values.email)
                .limit(1);

            if (profileError) throw profileError;

            if (!profiles || profiles.length === 0) {
                toast.error("User not found. They must register an account first.");
                setLoading(false);
                return;
            }

            const targetUserId = profiles[0].id;

            // 2. Check if user is already an admin
            const { data: existingAdmin } = await supabase
                .from("admins")
                .select("id")
                .eq("user_id", targetUserId)
                .maybeSingle();

            if (existingAdmin) {
                toast.error("This user is already an admin.");
                setLoading(false);
                return;
            }

            // 3. Check for existing pending invitation
            const { data: existingInvitation } = await supabase
                .from("admin_invitations" as any)
                .select("id, status, expires_at")
                .eq("target_user_id", targetUserId)
                .eq("status", "pending")
                .maybeSingle();

            if (existingInvitation) {
                const expiresAt = new Date(existingInvitation.expires_at);
                if (expiresAt > new Date()) {
                    toast.error("An active invitation already exists for this user.");
                    setLoading(false);
                    return;
                }
            }

            // 4. Generate invitation token
            const { data: tokenData, error: tokenError } = await supabase
                .rpc('generate_invitation_token' as any);

            if (tokenError) throw tokenError;
            const token = tokenData as string;

            // 5. Create invitation
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

            const { error: invitationError } = await supabase
                .from("admin_invitations" as any)
                .insert({
                    target_user_id: targetUserId,
                    invited_by: (await supabase.rpc('get_admin_id', { _user_id: user.id })).data,
                    token: token,
                    full_name: values.fullName,
                    is_super_admin: values.isSuperAdmin,
                    expires_at: expiresAt.toISOString(),
                });

            if (invitationError) throw invitationError;

            // 6. Send invitation email via Edge Function
            try {
                const { data: invitationRecord } = await supabase
                    .from("admin_invitations" as any)
                    .select("id")
                    .eq("token", token)
                    .single();

                if (invitationRecord) {
                    const { error: emailError } = await supabase.functions.invoke('send-admin-invitation', {
                        body: { invitationId: invitationRecord.id }
                    });

                    if (emailError) {
                        console.error("Error sending invitation email:", emailError);
                        toast.warning("Invitation created but email failed to send. Please share the link manually.");
                    }
                }
            } catch (emailError) {
                console.error("Error sending invitation email:", emailError);
                // Don't fail the whole operation if email fails
            }

            // 7. Log action
            await supabase.rpc('log_admin_action', {
                _admin_id: (await supabase.rpc('get_admin_id', { _user_id: user.id })).data,
                _action: 'create_invitation',
                _resource_type: 'admin_invitation',
                _resource_id: null,
                _details: {
                    target_user_email: values.email,
                    is_super_admin: values.isSuperAdmin,
                    expires_at: expiresAt.toISOString()
                }
            });

            // 8. Generate invitation link
            const invitationLink = `${window.location.origin}/admin/accept-invitation/${token}`;

            // Show success with link
            toast.success("Admin invitation sent successfully!");
            toast.info("Invitation email sent to " + values.email);

            // Copy link to clipboard as backup
            await navigator.clipboard.writeText(invitationLink);

            setOpen(false);
            form.reset();
            onSuccess();
        } catch (error: any) {
            console.error("Error creating invitation:", error);
            toast.error(error.message || "Failed to create invitation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Send Admin Invitation</DialogTitle>
                    <DialogDescription>
                        Send an invitation to grant admin privileges. The user must accept within 24 hours.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="user@example.com" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The email address of the registered user.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isSuperAdmin"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Super Admin</FormLabel>
                                        <FormDescription>
                                            Grant full access including user management.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Invitation
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
