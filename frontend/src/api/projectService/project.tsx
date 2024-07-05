import instance from "@/axios"
import { ProjectFormData } from "@/components/TenantUserPanel/Forms/ProjectForm"
import Cookies from 'js-cookie'

export const fetchAllProjects = async () => {
    try {
        const response = await instance.get('/project-service/v1/projects', {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const createProject = async (formData: ProjectFormData) => {
    try {
        const response = await instance.post('/project-service/v1/projects', formData, {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}