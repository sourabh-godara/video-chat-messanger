import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setError("");
        setStatus("loading");
        try {
            await api.post("/auth/forgot-password", { email });
            setStatus("sent");
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            setError(msg || "Something went wrong. Try again.");
            setStatus("idle");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-md">
                {status === "sent" ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-500">
                        <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                            📬
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Check your inbox</h2>
                        <p className="text-muted-foreground">
                            We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                            It expires in 15 minutes.
                        </p>
                        <p className="text-xs text-muted-foreground/70">Didn't get it? Check your spam folder.</p>
                        <Link to="/auth/signin" className="mt-4 text-sm font-medium text-primary hover:underline">
                            ← Back to sign in
                        </Link>
                    </div>
                ) : (
                    <>
                        <CardHeader className="space-y-2 text-center">
                            <div className="flex justify-center mb-2">
                                <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-2xl shadow-sm">
                                    🔑
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Forgot password?</CardTitle>
                            <CardDescription>
                                Enter your email address and we'll send you a link to reset your password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                
                                {error && (
                                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                        {error}
                                    </div>
                                )}
                                
                                <Button type="submit" className="w-full" disabled={status === "loading"}>
                                    {status === "loading" ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" /> : null}
                                    {status === "loading" ? "Sending reset link..." : "Send reset link"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center flex-wrap">
                            <Link to="/auth/signin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                ← Back to sign in
                            </Link>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}