import instance from "@/axios";
import { PlanFormData } from "@/components/AdminPanel/Forms/PlanForm";
import { TenantFormData } from "@/components/TenantForm/TenantForm";
import Cookies from 'js-cookie';


export const subscription = async (tenantId: string, planId: string) => {
    try {
        const response = await instance.post('/subscription-service/v1/subscriptions', { plan_id: planId, tenantId }, {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}


export const fetchPlans = async () => {
    try {
        const response = await instance.get('/subscription-service/v1/subscription-plans')
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchSubscriptionDetails = async (userId: string) => {
    try {
        const response = await instance.get(`subscription-service/v1/admin/subscriptions/users/${userId}`, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const blockPlan = async (planId: string) => {
    try {
        const response = await instance.patch(`subscription-service/v1/admin/subscription-plans/${planId}`, { active: false }, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const unBlockPlan = async (planId: string) => {
    try {
        const response = await instance.patch(`subscription-service/v1/admin/subscription-plans/${planId}`, { active: true }, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const deletePlan = async (planId: string) => {
    try {
        const response = await instance.delete(`subscription-service/v1/admin/subscription-plans/${planId}`, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const createPlan = async (formData: PlanFormData) => {
    try {
        const response = await instance.post('/subscription-service/v1/admin/subscription-plans', formData, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchPlanDetails = async (id: string) => {
    try {
        const response = await instance.get(`/subscription-service/v1/admin/subscription-plans/${id}`, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchSubscription = async () => {
    try {
        const response = await instance.get(`/subscription-service/v1/admin/subscriptions`, {
            headers: {
                Authorization: Cookies.get('team-sync-admin-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}