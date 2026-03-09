import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [form, setForm] = useState({ password: "", confirm: "" });
    const [errors, setErrors] = useState<{ password?: string; confirm?: string; general?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

    // Password strength
    const strength = (() => {
        const p = form.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    })();
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = ["", "#f87171", "#fb923c", "#facc15", "#4ade80"][strength];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: typeof errors = {};
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 8) errs.password = "At least 8 characters";
        if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setErrors({});
        setStatus("loading");
        try {
            await api.post("/auth/reset-password", { token, password: form.password });
            setStatus("done");
            setTimeout(() => navigate("/auth/signin", { replace: true }), 2000);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            setErrors({ general: msg || "Reset link is invalid or expired." });
            setStatus("idle");
        }
    };

    // No token in URL — show error state
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <div className="text-center max-w-md w-full animate-in fade-in duration-500">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-3xl">
                            🔗
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Invalid or expired link</h2>
                    <p className="text-muted-foreground mb-6">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                        <Link to="/auth/forgot-password">
                            Request a new link →
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-md">
                {status === "done" ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-500">
                        <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center text-2xl">
                            ✓
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Password updated</h2>
                        <p className="text-muted-foreground">Redirecting you to sign in…</p>
                    </div>
                ) : (
                    <>
                        <CardHeader className="space-y-2 text-center">
                            <div className="flex justify-center mb-2">
                                <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-2xl shadow-sm">
                                    🔒
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight">New password</CardTitle>
                            <CardDescription>
                                Choose a strong password for your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min. 8 characters"
                                            value={form.password}
                                            onChange={(e) => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: undefined })); }}
                                            autoFocus
                                            className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            onClick={() => setShowPassword(v => !v)}
                                        >
                                            {showPassword ? "🙈" : "👁"}
                                        </button>
                                    </div>
                                    
                                    {/* Strength meter */}
                                    {form.password && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4].map(n => (
                                                    <div
                                                        key={n}
                                                        className="w-7 h-1 rounded-sm transition-colors duration-300"
                                                        style={{ backgroundColor: strength >= n ? strengthColor : "rgba(156, 163, 175, 0.2)" }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs" style={{ color: strengthColor }}>{strengthLabel}</span>
                                        </div>
                                    )}
                                    {errors.password && <p className="text-sm font-medium text-destructive">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirm"
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="Re-enter password"
                                            value={form.confirm}
                                            onChange={(e) => { setForm(f => ({ ...f, confirm: e.target.value })); setErrors(er => ({ ...er, confirm: undefined })); }}
                                            className={`pr-10 ${errors.confirm ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            onClick={() => setShowConfirm(v => !v)}
                                        >
                                            {showConfirm ? "🙈" : "👁"}
                                        </button>
                                    </div>
                                    {errors.confirm && <p className="text-sm font-medium text-destructive">{errors.confirm}</p>}
                                </div>

                                {errors.general && (
                                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                        {errors.general}
                                    </div>
                                )}

                                <Button type="submit" className="w-full" disabled={status === "loading"}>
                                    {status === "loading" ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" /> : null}
                                    {status === "loading" ? "Updating password..." : "Update password"}
                                </Button>
                            </form>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
}