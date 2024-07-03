import instance from "@/axios";
import { TenantFormData } from "@/components/TenantForm/TenantForm";
import Cookies from 'js-cookie';


export const register = async (formData: TenantFormData) => {
    try {
        const response = await instance.post('/tenant-service/v1/tenants', formData, {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const createBranch = async (location: string) => {
    try {
        const response = await instance.post('/tenant-service/v1/tenants/branches', { location }, {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}