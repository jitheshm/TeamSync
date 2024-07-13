import instance from "@/axios";
import { PlanFormData } from "@/components/AdminPanel/Forms/PlanForm";
import { TenantFormData } from "@/components/TenantForm/TenantForm";
import Cookies from 'js-cookie';


export const subscription = async (tenantId: string, planId: string) => {
    try {
        const response = await instance.post('/subscription-service/v1/subscriptions', { plan_id: planId, tenantId })
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
        const response = await instance.get(`subscription-service/v1/admin/subscriptions/users/${userId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const blockPlan = async (planId: string) => {
    try {
        const response = await instance.patch(`subscription-service/v1/admin/subscription-plans/${planId}`, { active: false })
        return response.data
    } catch (error) {
        throw error
    }
}

export const unBlockPlan = async (planId: string) => {
    try {
        const response = await instance.patch(`subscription-service/v1/admin/subscription-plans/${planId}`, { active: true })
        return response.data
    } catch (error) {
        throw error
    }
}

export const deletePlan = async (planId: string) => {
    try {
        const response = await instance.delete(`subscription-service/v1/admin/subscription-plans/${planId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createPlan = async (formData: PlanFormData) => {
    try {
        const response = await instance.post('/subscription-service/v1/admin/subscription-plans', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchPlanDetails = async (id: string) => {
    try {
        const response = await instance.get(`/subscription-service/v1/admin/subscription-plans/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchSubscription = async () => {
    try {
        const response = await instance.get(`/subscription-service/v1/admin/subscriptions`,)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchSubscriptionForUser = async () => {
    try {
        const response = await instance.get(`subscription-service/v1/subscription`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const cancelSubscription = async (subscriptionId: string) => {
    try {
        const response = await instance.patch(`subscription-service/v1/subscriptions/${subscriptionId}/cancel`)
        return response.data
    } catch (error) {
        throw error
    }
}