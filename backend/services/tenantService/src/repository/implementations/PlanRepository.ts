
import mongoose, { ObjectId } from "mongoose";
import IPlan from "../../entities/PlanEntity";
import switchDb from "../../utils/switchDb";
import { IPlanRepository } from "../interfaces/IPlanRepository";
import { injectable } from "inversify";



@injectable()
export default class PlanRepository implements IPlanRepository {

    async create(data: IPlan) {
        try {
            const PlanModel = switchDb<IPlan>(`${process.env.SERVICE}_main`, 'plans')
            const newPlan = new PlanModel(data)
            await newPlan.save()
        } catch (error) {
            console.log('Error in PlanRepository create method');

            console.log(error);

            throw error
        }
    }

    async update(data: Partial<IPlan>, id: mongoose.Types.ObjectId) {
        try {
            const PlanModel = switchDb<IPlan>(`${process.env.SERVICE}_main`, 'plans')
            let resObj = await PlanModel.findOneAndUpdate({ _id: id }, data,{new:true})
            return resObj

        } catch (error) {
            console.log('Error in PlanRepository create method');

            console.log(error);

            throw error
        }
    }

    async fetchAll() {
        try {
            const PlanModel = switchDb<IPlan>(`${process.env.SERVICE}_main`, 'plans')
            let data = await PlanModel.find({is_deleted:false})
            return data
        } catch (error) {
            console.log('Error in PlanRepository fetchAll method');

            console.log(error);

            throw error
        }
    }

    async fetchById(id: mongoose.Types.ObjectId){
        try {
            const PlanModel = switchDb<IPlan>(`${process.env.SERVICE}_main`, 'plans')
            let data = await PlanModel.findOne({_id:id})
            return data
        } catch (error) {
            console.log('Error in PlanRepository fetchById method');

            console.log(error);

            throw error
        }
    }

}