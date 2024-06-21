
import IPlan from "../../entities/PlanEntity";
import switchDb from "../../utils/switchDb";
import { IPlanRepository } from "../interfaces/IPlanRepository";




export default class PlanRepository implements IPlanRepository {
    
    async create(data: IPlan) {
        try {
            const PlanModel = switchDb<IPlan>(`${process.env.SERVICE}_main`, 'plans')
          const newPlan=new PlanModel(data)
          await newPlan.save()
        } catch (error) {
            console.log('Error in PlanRepository create method');

            console.log(error);

            throw error
        }
    }

}