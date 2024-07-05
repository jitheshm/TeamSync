import instance from "@/axios"
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