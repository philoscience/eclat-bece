import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, XCircle, Loader2, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { format } from "date-fns";

interface InvitationDetails {
    id: string;
    full_name: string;
    is_super_admin: boolean;
    expires_at: string;
    invited_by_name: string;
    target_user_email: string;
}

export default function AcceptInvitationPage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
    const [error, setError] = useState("");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        checkAuthAndLoadInvitation();
    }, [token]);

    const checkAuthAndLoadInvitation = async () => {
        try {
            // Check if user is logged in
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            if (!currentUser) {
                setError("You must be logged in to accept an admin invitation.");
                setLoading(false);
                return;
            }

            setUser(currentUser);

            // Load invitation details
            const { data: invitationData, error: invitationError } = await supabase
                .from("admin_invitations" as any)
                .select(`
                    id,
                    full_name,
                    is_super_admin,
                    expires_at,
                    status,
                    target_user_id,
                    invited_by
                `)
                .eq("token", token)
                .maybeSingle();

            if (invitationError) throw invitationError;

            if (!invitationData) {
                setError("Invalid invitation link.");
                setLoading(false);
                return;
            }

            // Check if invitation is for this user
            if (invitationData.target_user_id !== currentUser.id) {
                setError("This invitation is not for your account.");
                setLoading(false);
                return;
            }

            // Check if already accepted
            if (invitationData.status === "accepted") {
                setError("This invitation has already been accepted.");
                setLoading(false);
                return;
            }

            // Check if expired
            const expiresAt = new Date(invitationData.expires_at);
            if (expiresAt < new Date() || invitationData.status === "expired") {
                setError("This invitation has expired.");
                setLoading(false);
                return;
            }

            // Get user's email
            const { data: profileData } = await supabase
                .from("profiles")
                .select("email")
                .eq("id", currentUser.id)
                .single();

            // Get inviter's name
            const { data: inviterData } = await supabase
                .from("admins" as any)
                .select("full_name")
                .eq("id", invitationData.invited_by)
                .single();

            setInvitation({
                id: invitationData.id,
                full_name: invitationData.full_name,
                is_super_admin: invitationData.is_super_admin,
                expires_at: invitationData.expires_at,
                invited_by_name: inviterData?.full_name || "Unknown",
                target_user_email: profileData?.email || currentUser.email || "",
            });

            setLoading(false);
        } catch (error: any) {
            console.error("Error loading invitation:", error);
            setError(error.message || "Failed to load invitation details.");
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!token) return;
        setAccepting(true);

        try {
            const { data, error } = await supabase
                .rpc('accept_admin_invitation' as any, { _token: token });

            if (error) throw error;

            const result = data as any;
            if (!result.success) {
                throw new Error(result.error || "Failed to accept invitation");
            }

            toast.success("Admin privileges granted successfully!");

            // Redirect to admin login
            setTimeout(() => {
                navigate("/admin/login");
            }, 2000);
        } catch (error: any) {
            console.error("Error accepting invitation:", error);
            toast.error(error.message || "Failed to accept invitation");
            setAccepting(false);
        }
    };

    const handleDecline = () => {
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-background flex items-center justify-center p-4">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading invitation...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-background flex items-center justify-center p-4">
                <div className="fixed top-4 right-4 z-50">
                    <ThemeToggle />
                </div>
                <Card className="w-full max-w-md shadow-2xl border-2">
                    <CardHeader className="text-center pb-8">
                        <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
                            <XCircle className="w-10 h-10 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Invalid Invitation</CardTitle>
                        <CardDescription className="text-base mt-2">{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate("/")} className="w-full">
                            Go to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!invitation) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-background flex items-center justify-center p-4">
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <Card className="w-full max-w-md shadow-2xl border-2">
                <CardHeader className="space-y-4 text-center pb-8">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                        <Shield className="w-10 h-10 text-primary-foreground" />
                    </div>

                    <div>
                        <CardTitle className="text-3xl font-bold">Admin Invitation</CardTitle>
                        <CardDescription className="text-base mt-2">
                            You've been invited to join as an administrator
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Invitation Details */}
                    <div className="space-y-4">
                        <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">Invited By</p>
                                    <p className="text-sm text-muted-foreground">{invitation.invited_by_name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">Role</p>
                                    <p className="text-sm text-muted-foreground">
                                        {invitation.is_super_admin ? "Super Administrator" : "Administrator"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">Expires</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(invitation.expires_at), "PPpp")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                <strong>Important:</strong> By accepting this invitation, you will gain administrative privileges on the Éclat Platform. Please ensure you understand the responsibilities that come with this role.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleDecline}
                            disabled={accepting}
                            className="flex-1"
                        >
                            Decline
                        </Button>
                        <Button
                            onClick={handleAccept}
                            disabled={accepting}
                            className="flex-1"
                        >
                            {accepting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Accepting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Accept Invitation
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t text-center">
                        <p className="text-xs text-muted-foreground">
                            Logged in as: <strong>{invitation.target_user_email}</strong>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
