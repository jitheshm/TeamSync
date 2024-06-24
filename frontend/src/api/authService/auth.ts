import instance from "@/axios";
import { LoginFormData } from "@/components/Login/Login";
import Cookies from 'js-cookie';

export const login = async (formData: LoginFormData) => {
    try {
        const response = await instance.post('/auth-service/v1/login', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const verifyToken = async (token:string) => {
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