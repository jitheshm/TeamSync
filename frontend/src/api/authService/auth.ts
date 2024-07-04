import instance from "@/axios";
import { AdminFormValues } from "@/components/AdminPanel/Login";
import { ForgotPasswordFormData } from "@/components/Login/ForgotPassword";
import { LoginFormData } from "@/components/Login/Login";
import { ResetFormData } from "@/components/Login/NewPassword";
import { OtpFormData } from "@/components/Login/Otp";
import { LoginFormValues } from "@/components/TenantUserPanel/Login/Login";
import Cookies from 'js-cookie';

export const login = async (formData: LoginFormData) => {
    try {
        const response = await instance.post('/auth-service/v1/login', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const verifyToken = async (token: string) => {
    try {
        const response = await instance.get('/auth-service/v1/token/verify', {
            headers: {
                Authorization: token
            }
        })

        return response.data
    } catch (error) {
        throw error
    }
}

export const forgetPassword = async (formData: ForgotPasswordFormData) => {
    try {
        const response = await instance.post('/auth-service/v1/forget-password', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const verifyOtp = async (formData: OtpFormData, email: string, context: string) => {
    try {
        const otp = `${formData.otp1}${formData.otp2}${formData.otp3}${formData.otp4}${formData.otp5}${formData.otp6}`
        const response = await instance.post('/auth-service/v1/verify-otp', { email, otp, context: context })
        return response.data
    } catch (error) {
        throw error
    }
}

export const passwordReset = async (formData: ResetFormData) => {
    try {
        const response = await instance.post('/auth-service/v1/reset-password', formData, {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}


export const firebaseLogin = async (token: string) => {
    try {
        const response = await instance.post('/auth-service/v1/login/firebase', { token })
        return response.data
    } catch (error) {
        throw error
    }
}

export const adminLogin = async (formData: AdminFormValues) => {
    try {
        const response = await instance.post('/auth-service/v1/admin/login', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const verifyAdminToken = async (token: string) => {
    try {
        const response = await instance.get('/auth-service/v1/admin/token/verify', {
            headers: {
                Authorization: token
            }
        })

        return response.data
    } catch (error) {
        throw error
    }
}

export const tenantLogin = async (formData:LoginFormValues ) => {
    try {
        const response = await instance.post('/auth-service/v1/tenant/login', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const verifyTenantOtp = async (formData: OtpFormData, email: string, context: string,tenantId:string) => {
    try {
        console.log(tenantId);
        
        const otp = `${formData.otp1}${formData.otp2}${formData.otp3}${formData.otp4}${formData.otp5}${formData.otp6}`
        const response = await instance.post('/auth-service/v1/verify-otp', { email, otp, context: context,tenantId:tenantId })
        return response.data
    } catch (error) {
        throw error
    }
}