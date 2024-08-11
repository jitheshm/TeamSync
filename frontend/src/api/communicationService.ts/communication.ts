import { userInstance as instance } from "@/axios"

interface ScheduleMeetingFormData {
    meetingTitle: string;
    meetingDate: string;
    meetingTime: string;
    participants: string[];
}
export const scheduleMeeting = async (formData: ScheduleMeetingFormData) => {
    try {
        const response = await instance.post('/communication-service/v1/meeting', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchMeeting = async (search: string, page: number, limit: number) => {
    try {
        const response = await instance.get('/communication-service/v1/meetings', {
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