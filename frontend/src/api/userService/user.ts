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

export const blockUser = async (id: string) => {
    try {
        const response = await instance.patch(`/user-service/v1/admin/users/block/${id}`, {}, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}
export const unBlockUser = async (id: string) => {
    try {
        const response = await instance.patch(`/user-service/v1/admin/users/unblock/${id}`, {}, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteUser = async (id: string) => {
    try {
        const response = await instance.delete(`/user-service/v1/admin/users/${id}`, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchUser = async (id: string) => {
    try {
        const response = await instance.get(`/user-service/v1/admin/users/${id}`, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}


export const register = async (formData: RegisterFormData) => {
    try {
        const response = await instance.post('/user-service/v1/admin/users', formData, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const tenantUserRegister = async (formData: TenantRegisterFormData) => {
    try {
        const response = await instance.post('/user-service/v1/tenants/users', formData, {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const tenantUserUpdate = async (formData: TenantRegisterFormData, id: string) => {
    try {
        const response = await instance.put(`/user-service/v1/tenants/users/${id}`, formData, {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const tenantUserDelete = async (branchId: string, id: string) => {
    try {
        const response = await instance.delete(`/user-service/v1/tenants/branches/${branchId}/users/${id}`, {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchTenantUsers = async () => {
    try {
        const response = await instance.get('/user-service/v1/tenants/users', {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchTenantSpecificUser = async (userId:string) => {
    try {
        const response = await instance.get(`/user-service/v1/tenants/users/${userId}`, {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}