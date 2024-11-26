import AppLayout from "@/components/AppLayout";
import SocketProvider from "@/Providers";

export default function layout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <SocketProvider>
            <AppLayout>
                {children}
            </AppLayout>
        </SocketProvider>
    )


}