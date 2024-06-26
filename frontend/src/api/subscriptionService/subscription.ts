import instance from "@/axios";
import { TenantFormData } from "@/components/TenantForm/TenantForm";
import Cookies from 'js-cookie';


export const subscription = async (tenantId:string,planId:string) => {
    try {
        const response = await instance.post('/subscription-service/v1/subscriptions', { plan_id: 'plan_QMW3ocq96v5XvP',tenantId }, {
            headers: {
                Authorization: Cookies.get('team-sync-user-token')
            }

        })
        return response.data
    } catch (error) {
        throw error
    }
}