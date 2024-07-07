import instance from "@/axios";
import { RegisterFormData } from "@/components/AdminPanel/Forms/UserForm";
import { TenantRegisterFormData } from "@/components/Forms/UserForm";
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
        const response = await instance.get('/user-service/v1/admin/users')
        return response.data
    } catch (error) {
        throw error
    }
}

export const blockUser = async (id: string) => {
    try {
        const response = await instance.patch(`/user-service/v1/admin/users/block/${id}`, {})
        return response.data
    } catch (error) {
        throw error
    }
}
export const unBlockUser = async (id: string) => {
    try {
        const response = await instance.patch(`/user-service/v1/admin/users/unblock/${id}`, {})
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteUser = async (id: string) => {
    try {
        const response = await instance.delete(`/user-service/v1/admin/users/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchUser = async (id: string) => {
    try {
        const response = await instance.get(`/user-service/v1/admin/users/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}


export const register = async (formData: RegisterFormData) => {
    try {
        const response = await instance.post('/user-service/v1/admin/users', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const tenantUserRegister = async (formData: TenantRegisterFormData) => {
    try {
        const response = await instance.post('/user-service/v1/tenants/users', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const tenantUserUpdate = async (formData: TenantRegisterFormData, id: string) => {
    try {
        const response = await instance.put(`/user-service/v1/tenants/users/${id}`, formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const tenantUserDelete = async (branchId: string, id: string, role: string) => {
    try {
        const response = await instance.delete(`/user-service/v1/tenants/branches/${branchId}/users/${id}`, {

            data: {
                role: role
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchTenantUsers = async (role: string) => {
    try {
        if (role === '') {
            var url = '/user-service/v1/tenants/users'
        } else {
            url = `/user-service/v1/tenants/users?role=${role}`
        }
        const response = await instance.get(url)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchTenantSpecificUser = async (userId: string) => {
    try {
        const response = await instance.get(`/user-service/v1/tenants/users/${userId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

