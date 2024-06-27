import instance from "@/axios";
import { SignupFormData } from "@/components/Login/SignUp";
import Cookies from 'js-cookie'

export const signup = async (formData: SignupFormData) => {
    try {
        const response = await instance.post('/user-service/v1/register', formData)
        return response.data
    } catch (error) {
        throw error
    }
}


export const fetchUsers = async () => {
    try {
        const response = await instance.get('/user-service/v1/admin/users', {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}
