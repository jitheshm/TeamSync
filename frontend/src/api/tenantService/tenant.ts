import instance from "@/axios";
import { TenantFormData } from "@/components/TenantForm/TenantForm";
import Cookies from 'js-cookie';


export const register = async (formData: TenantFormData) => {
    try {
        const response = await instance.post('/tenant-service/v1/tenants', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createBranch = async (location: string) => {
    try {
        const response = await instance.post('/tenant-service/v1/tenants/branches', { location })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchBranches = async (searchTerm: string, page: number, limit: number) => {
    try {
        const response = await instance.get('/tenant-service/v1/tenants/branches', {
            params: { name: searchTerm, page, limit }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteBranch = async (id: string) => {
    try {
        const response = await instance.delete(`/tenant-service/v1/tenants/branches/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchBranch = async (id: string) => {
    try {
        const response = await instance.get(`/tenant-service/v1/tenants/branches/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateBranch = async (location: string, id: string) => {
    try {
        const response = await instance.put(`/tenant-service/v1/tenants/branches/${id}`, { location });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchTenantByName = async (name: string) => {
    try {
        const response = await instance.get(`/tenant-service/v1/tenants/${name}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
