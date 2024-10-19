'use client'
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaGoogle } from "react-icons/fa";
import Image from "next/image"
import { signIn } from "next-auth/react";

export default function page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/pigeon.png"
                            alt="ChatterBox logo"
                            className="h-16 w-16 rounded-full"
                            width={64}
                            height={64}
                        />
                    </div>
                    <CardTitle className="text-3xl font-bold">Welcome to ChatterBox</CardTitle>
                    <CardDescription>Sign in to start chatting with your friends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={() =>
                        signIn("google", {
                            callbackUrl: "/",
                        })
                    } className="w-full" variant="outline">
                        <FaGoogle className="mr-2 h-4 w-4" />
                        Sign in with Google
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                    <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
                    <p>ChatterBox - Connect, Chat, and Collaborate</p>
                </CardFooter>
            </Card>
        </div>
    )
}