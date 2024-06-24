import instance from "@/axios";
import { ForgotPasswordFormData } from "@/components/Login/ForgotPassword";
import { LoginFormData } from "@/components/Login/Login";
import { OtpFormData } from "@/components/Login/Otp";
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

export const verifyOtp = async (formData: OtpFormData, email:string) => {
    try {
        const otp = `${formData.otp1}${formData.otp2}${formData.otp3}${formData.otp4}${formData.otp5}${formData.otp6}`
        const response = await instance.post('/auth-service/v1/verify-otp', {email, otp,context:"forgot-password"})
        return response.data
    } catch (error) {
        throw error
    }
}