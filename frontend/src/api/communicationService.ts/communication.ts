import instance from "@/axios"

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