
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
            return newPlan
        } catch (error) {
            console.log('Error in PlanRepository create method');

            console.log(error);

            throw error
        }
    }

    async update(data: Partial<IPlan>, id: mongoose.Types.ObjectId) {
        try {
            const PlanModel = switchDb<IPlan>(`${process.env.SERVICE}_main`, 'plans')
            let resObj = await PlanModel.findOneAndUpdate({ _id: id }, data, { new: true })
            return resObj

        } catch (error) {
            console.log('Error in PlanRepository create method');

            console.log(error);

            throw error
        }
    }

    async fetchAll(page:number, limit:number, name:string | null) {
        try {
            console.log(name,name);
            
            const PlanModel = switchDb<IPlan>(`${process.env.SERVICE}_main`, 'plans')
            let data = null
            const matchStage: any = {
                is_deleted:false,
            };
            console.log(matchStage,">>>>>>>>>>>>>>>")
            if (name) {
                matchStage.name = { $regex: `^${name}`, $options: 'i' };
            }

            data=await PlanModel.aggregate([
                {
                    $match:matchStage
                },
                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: limit
                }
            ])
            const countPipeline = [
                {
                    $match: matchStage
                },
                {
                    $count: 'total'
                }
            ];
            const totalCountResult = await PlanModel.aggregate(countPipeline).exec();
            const total = totalCountResult.length > 0 ? totalCountResult[0].total : 0;

            return { data, total };
        } catch (error) {
            console.log('Error in PlanRepository fetchAll method');

            console.log(error);

            throw error
        }
    }

    async fetchAvailablePlans(page:number, limit:number, name:string | null) {
        try {
            console.log(name);
            
            const PlanModel = switchDb<IPlan>(`${process.env.SERVICE}_main`, 'plans')
            let data = null
            const matchStage: any = {
                is_deleted:false,
                active:true
            };

            if (name) {
                matchStage.name = { $regex: `^${name}`, $options: 'i' };
            }

            data=await PlanModel.aggregate([
                {
                    $match:matchStage
                },
                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: limit
                }
            ])
            const countPipeline = [
                {
                    $match: matchStage
                },
                {
                    $count: 'total'
                }
            ];
            const totalCountResult = await PlanModel.aggregate(countPipeline).exec();
            const total = totalCountResult.length > 0 ? totalCountResult[0].total : 0;

            return { data, total };
        } catch (error) {
            console.log('Error in PlanRepository fetchAll method');

            console.log(error);

            throw error
        }
    }

    async fetchById(id: mongoose.Types.ObjectId) {
        try {
            const PlanModel = switchDb<IPlan>(`${process.env.SERVICE}_main`, 'plans')
            let data = await PlanModel.findOne({ _id: id })
            return data
        } catch (error) {
            console.log('Error in PlanRepository fetchById method');

            console.log(error);

            throw error
        }
    }

}