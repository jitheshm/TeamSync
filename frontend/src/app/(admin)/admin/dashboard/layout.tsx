"use client"
import AdminLayout from "@/components/Layout/AdminLayout"
import { verify } from "@/features/admin/adminSlice"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Cookies from "js-cookie"
import Loading from "@/components/Loading/Loading"

interface AdminState {
    verified: boolean
}

interface RootState {
    admin: AdminState
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [loading, setLoading] = useState<boolean>(true)

    const { verified } = useSelector((state: RootState) => state.admin)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (verified) {
            setLoading(false)
        } else {
            
            router.push('/admin/login')
        }
    }, [verified])

    return (
        <>
            {
                loading ? <Loading background="bg-dark" /> : <AdminLayout>
                    {
                        children
                    }
                </AdminLayout>
            }
        </>
    )

}