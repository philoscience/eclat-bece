import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface SystemSetting {
    key: string;
    value: any;
    description: string;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SystemSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("system_settings")
                .select("*")
                .order("key");

            if (error) throw error;
            setSettings(data || []);
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (key: string, newValue: any) => {
        setSettings(settings.map(s =>
            s.key === key ? { ...s, value: newValue } : s
        ));
    };

    const saveSettings = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const adminIdRes = await supabase.rpc('get_admin_id', { _user_id: user.id });
            const adminId = adminIdRes.data;

            // Update each setting
            const updates = settings.map(setting =>
                supabase
                    .from("system_settings")
                    .update({
                        value: setting.value,
                        updated_by: adminId,
                        updated_at: new Date().toISOString()
                    })
                    .eq("key", setting.key)
            );

            await Promise.all(updates);

            toast.success("Settings saved successfully");
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground">
                    Manage global application configurations.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        General Configuration
                    </CardTitle>
                    <CardDescription>
                        Control core system behaviors and public-facing information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {settings.map((setting) => (
                        <div key={setting.key} className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor={setting.key} className="text-base font-medium">
                                    {setting.key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </Label>
                                {typeof setting.value === 'boolean' && (
                                    <Switch
                                        id={setting.key}
                                        checked={setting.value}
                                        onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                                    />
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {setting.description}
                            </p>

                            {typeof setting.value !== 'boolean' && (
                                <Input
                                    id={setting.key}
                                    value={setting.value || ''}
                                    onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                                    className="max-w-md"
                                />
                            )}
                        </div>
                    ))}

                    <div className="pt-4 flex justify-end">
                        <Button onClick={saveSettings} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
