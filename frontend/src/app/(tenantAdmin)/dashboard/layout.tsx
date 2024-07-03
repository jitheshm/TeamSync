"use client"
import { verifyToken } from "@/api/authService/auth"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Cookies from "js-cookie"
import Loading from "@/components/Loading/Loading"
import TenantAdminLayout from "@/components/Layout/TenantAdminLayout"
import { verify } from "@/features/user/userSlice"

interface UserState {
    name: string
    verified: boolean
    tenantId: string
}

interface RootState {
    user: UserState
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [loading, setLoading] = useState<boolean>(true)

    const { verified } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (verified) {
            setLoading(false)
        } else {
            // const token = Cookies.get('team-sync-user-token')
            // if (token) {
            //     verifyToken(token).then((res) => {
            //         console.log(res);
            //         dispatch(verify({ name: res.user }))
            //         setLoading(false)

            //     }).catch((error) => {
            //         console.log(error);
            //         router.push('/login')



            //     })
            // } else {
            //     router.push('/login')
            // }

            router.push('/login')
        }
    }, [verified])

    return (
        <>
            {
                loading ? <Loading background="bg-dark" /> :
                    <TenantAdminLayout>
                        {
                            children
                        }
                    </TenantAdminLayout>
            }
        </>
    )

}