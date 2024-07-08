import instance from "@/axios"
import { ProjectFormData } from "@/components/TenantUserPanel/Forms/ProjectForm"
import Cookies from 'js-cookie'
import { string } from "zod"



export const createProject = async (formData: ProjectFormData) => {
    try {
        const response = await instance.post('/project-service/v1/projects', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchSpecificProject = async (id: string) => {
    try {
        const response = await instance.get(`/project-service/v1/projects/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateProject = async (formData: ProjectFormData,id:string) => {
    try {
        const response = await instance.put(`/project-service/v1/projects/${id}`, formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const projectDelete = async (id:string) => {
    try {
        const response = await instance.delete(`/project-service/v1/projects/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchSpecificProjectDetails = async (id: string) => {
    try {
        const response = await instance.get(`/project-service/v1/projects/${id}/details`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchAllProjectsByPManager = async (search: string, page: number, limit: number) => {
    try {
        const response = await instance.get('/project-service/v1/projects', {
            params: {
                pm: true,
                search,
                page,
                limit
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchAllProjects = async (search: string, page: number, limit: number) => {
    try {
        const response = await instance.get('/project-service/v1/projects', {
            params: {
                search,
                page,
                limit
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}