import instance from "@/axios"
import { ProjectFormData } from "@/components/TenantUserPanel/Forms/ProjectForm"
import { TaskFormData } from "@/components/TenantUserPanel/Forms/TaskForm"
import { TicketFormData } from "@/components/TenantUserPanel/Forms/TicketForm"
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

export const updateProject = async (formData: ProjectFormData, id: string) => {
    try {
        const response = await instance.put(`/project-service/v1/projects/${id}`, formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const projectDelete = async (id: string) => {
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


export const fetchAllProjectsDeveloper = async (search: string, page: number, limit: number) => {
    try {
        const response = await instance.get('/project-service/v1/projects', {
            params: {
                dev: true,
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

export const fetchAllProjectsTester = async (search: string, page: number, limit: number) => {
    try {
        const response = await instance.get('/project-service/v1/projects', {
            params: {
                test: true,
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

export const fetchAvailableProjectUsers = async (projectId: string) => {
    try {
        const response = await instance.get(`/project-service/v1/projects/${projectId}/users/available`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createTask = async (formData: TaskFormData, projectId: string) => {
    try {
        const response = await instance.post(`/project-service/v1/projects/${projectId}/tasks`, formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchAllTasks = async (projectId: string, search: string, page: number, limit: number) => {
    try {
        const response = await instance.get(`/project-service/v1/projects/${projectId}/tasks`, {
            params: {
                search,
                page,
                limit
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchSpecificTaskDetails = async (projectId: string, taskId: string) => {
    try {
        const response = await instance.get(`/project-service/v1/projects/${projectId}/tasks/${taskId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateTask = async (formData: TaskFormData, projectId: string, taskId: string) => {
    try {
        const { developer, tester, ...data } = formData
        const response = await instance.put(`/project-service/v1/projects/${projectId}/tasks/${taskId}`, data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const taskDelete = async (taskId: string, projectId: string) => {
    try {
        const response = await instance.delete(`/project-service/v1/projects/${projectId}/tasks/${taskId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateProjectStatus = async (data: { stage: string }, id: string) => {
    try {
        const response = await instance.put(`/project-service/v1/projects/${id}/status`, data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateTaskStatus = async (data: { status: string }, projectId: string, taskId: string) => {
    try {
        const response = await instance.put(`/project-service/v1/projects/${projectId}/tasks/${taskId}/status`, data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createTicket = async (formData: FormData, projectId: string, taskId: string) => {
    try {
        const response = await instance.post(`/project-service/v1/projects/${projectId}/tasks/${taskId}/tickets`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchAllTaskTickets = async (projectId: string, taskId: string, search: string, page: number, limit: number) => {
    try {
        const response = await instance.get(`/project-service/v1/projects/${projectId}/tasks/${taskId}/tickets`, {
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

export const updateTicketStatus = async (data: { status: string }, projectId: string, taskId: string, ticketId: string) => {
    try {
        const response = await instance.patch(`/project-service/v1/projects/${projectId}/tasks/${taskId}/tickets/${ticketId}/status`, data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const ticketDelete = async (ticketId: string, taskId: string, projectId: string) => {
    try {
        const response = await instance.delete(`/project-service/v1/projects/${projectId}/tasks/${taskId}/tickets/${ticketId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchSpecificTicketDetails = async (projectId: string, taskId: string, ticketId: string) => {
    try {
        const response = await instance.get(`/project-service/v1/projects/${projectId}/tickets/${ticketId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateTicket = async (formData: FormData, projectId: string, taskId: string, ticketId: string) => {
    try {

        const response = await instance.put(`/project-service/v1/projects/${projectId}/tasks/${taskId}/tickets/${ticketId}`, formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchRecentProjects = async () => {
    try {
        const response = await instance.get('/project-service/v1/projects/recent')
        return response.data
    } catch (error) {
        throw error
    }
}