import AdminLayout from "@/components/Layout/AdminLayout"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AdminLayout>{children}</AdminLayout>
}