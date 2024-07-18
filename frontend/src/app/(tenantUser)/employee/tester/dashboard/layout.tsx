"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState, ReactNode } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loading from "@/components/Loading/Loading"
import { logout } from "@/features/user/userSlice"
import TenantTesterLayout from "@/components/Layout/TenantTesterLayout"

interface UserState {
    name: string
    verified: boolean
    tenantId: string
    role: string
}

interface RootState {
    user: UserState
}

export default function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    const [loading, setLoading] = useState<boolean>(true)

    const { verified, role } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (verified && role === 'Tester') {
            setLoading(false)
        } else {
            dispatch(logout())
            router.push('/employee/login')
        }
    }, [verified, role])



    return (
        <>
            {loading ? <Loading background="bg-dark" /> : <TenantTesterLayout>{children}</TenantTesterLayout>}
        </>
    )
}
