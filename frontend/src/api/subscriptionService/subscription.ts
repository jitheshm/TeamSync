import {adminInstance, userInstance as instance} from "@/axios";
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


export const fetchPlans = async (search?: string, page?: number, limit?: number) => {
    try {
        const url = '/subscription-service/v1/admin/subscription-plans'
        const params:any={}
        if (page && limit) {
            params.page=page
            params.limit=limit
        }
        if (search) {
            params.name = search
        }
        const response = await adminInstance.get(url, { params })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchAvailablePlans = async (search?: string, page?: number, limit?: number) => {
    try {
        const url = '/subscription-service/v1/subscription-plans'
        const params:any={}
        if (page && limit) {
            params.page=page
            params.limit=limit
        }
        if (search) {
            params.name = search
        }
        const response = await instance.get(url, { params })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchSubscriptionDetails = async (userId: string) => {
    try {
        const response = await adminInstance.get(`subscription-service/v1/admin/subscriptions/users/${userId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const blockPlan = async (planId: string) => {
    try {
        const response = await adminInstance.patch(`subscription-service/v1/admin/subscription-plans/${planId}`, { active: false })
        return response.data
    } catch (error) {
        throw error
    }
}

export const unBlockPlan = async (planId: string) => {
    try {
        const response = await adminInstance.patch(`subscription-service/v1/admin/subscription-plans/${planId}`, { active: true })
        return response.data
    } catch (error) {
        throw error
    }
}

export const deletePlan = async (planId: string) => {
    try {
        const response = await adminInstance.delete(`subscription-service/v1/admin/subscription-plans/${planId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createPlan = async (formData: PlanFormData) => {
    try {
        const response = await adminInstance.post('/subscription-service/v1/admin/subscription-plans', formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchPlanDetails = async (id: string) => {
    try {
        const response = await adminInstance.get(`/subscription-service/v1/admin/subscription-plans/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchSubscription = async (name: string, page: number, limit: number) => {
    try {
        let url = '/subscription-service/v1/admin/subscriptions';
        const params: any = {
            page,
            limit
        };


        if (name) {
            params.name = name;
        }
        const response = await adminInstance.get(url, { params });
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

export const updateSubscriptionPlan = async (subscriptionId: string, customerId: string, planId: string) => {
    try {
        const response = await instance.patch(`subscription-service/v1/subscriptions/${subscriptionId}/customers/${customerId}`, {
            plan_id: planId
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchProfit = async () => {
    try {
        const response = await adminInstance.get('/subscription-service/v1/admin/subscriptions/profit')
        return response.data
    } catch (error) {
        throw error
    }
}
export const popularPlan = async () => {
    try {
        const response = await adminInstance.get('/subscription-service/v1/admin/subscription-plans/stats')
        return response.data
    } catch (error) {
        throw error
    }
}

export const retryPayment=async (invoiceId:string)=>{
    try {
        const response = await instance.post('/subscription-service/v1/subscriptions/retry', { invoiceId })
        return response.data
    } catch (error) {
        throw error
    }
}