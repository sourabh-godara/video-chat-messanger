import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import type { AuthUser } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_AUTH_URL ?? "/auth"}/google`;

export default function SignUpPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [errors, setErrors] = useState<Partial<typeof form & { general: string }>>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const validate = () => {
        const e: typeof errors = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.email) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 8) e.password = "At least 8 characters";
        if (form.password !== form.confirm) e.confirm = "Passwords do not match";
        return e;
    };

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        setErrors((er) => ({ ...er, [field]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        try {
            const res = await api.post<{ accessToken: string; user: AuthUser }>("/auth/register", {
                name: form.name.trim(),
                email: form.email,
                password: form.password,
            });
            setAuth(res.data.user, res.data.accessToken);
            navigate("/", { replace: true });
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            setErrors({ general: msg || "Something went wrong. Try again." });
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shadow-sm">
                            🐦
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Create account</CardTitle>
                    <CardDescription>
                        Join ChatterBox — it's free
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Alex Johnson"
                                value={form.name}
                                onChange={handleChange("name")}
                                autoFocus
                                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.name && <p className="text-sm font-medium text-destructive">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange("email")}
                                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.email && <p className="text-sm font-medium text-destructive">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters"
                                    value={form.password}
                                    onChange={handleChange("password")}
                                    className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowPassword((v) => !v)}
                                >
                                    {showPassword ? "🙈" : "👁"}
                                </button>
                            </div>

                            {/* Strength meter */}
                            {form.password && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((n) => (
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

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirm"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Re-enter password"
                                    value={form.confirm}
                                    onChange={handleChange("confirm")}
                                    className={`pr-10 ${errors.confirm ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowConfirm((v) => !v)}
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

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" /> : null}
                            {loading ? "Creating account..." : "Create account"}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => (window.location.href = GOOGLE_AUTH_URL)}
                    >
                        <FaGoogle className="mr-2 h-4 w-4" />
                        Sign up with Google
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center flex-wrap">
                    <div className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/auth/signin" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}