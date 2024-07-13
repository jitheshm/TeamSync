
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import { IBranchRepository } from "../interfaces/IBranchRepository";
import { IBranches } from "../../entities/BranchEntity";





export default class BranchRepository implements IBranchRepository {

    async create(data: IBranches, dbId: string) {
        try {
            const BranchModel = switchDb<IBranches>(`${process.env.SERVICE}_${dbId}`, 'branches')
            const newBranch = new BranchModel(data)
            await newBranch.save()
            return newBranch
        } catch (error) {
            console.log('Error in Branch Repository create method');

            console.log(error);

            throw error
        }
    }
    async fetchBranches(dbId: string,name: string | null, page: number, limit: number) {
        try {
            console.log(dbId);

            const BranchModel = switchDb<IBranches>(`${process.env.SERVICE}_${dbId}`, 'branches')
            let data = null;
    
            const matchStage: any = {
                is_deleted: false
            };
    
    
            if (name) {
                matchStage.location = { $regex: `^${name}`, $options: 'i' };
            }
    
            const aggregationPipeline = [
                {
                    $match: matchStage
                },
               
                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: limit
                }
            ];
    
            data = await BranchModel.aggregate(aggregationPipeline).exec();
    
            const countPipeline = [
                {
                    $match: matchStage
                },
                {
                    $count: 'total'
                }
            ];
    
            const totalCountResult = await BranchModel.aggregate(countPipeline).exec();
            const total = totalCountResult.length > 0 ? totalCountResult[0].total : 0;
    
            return { data, total };
        } catch (error) {
            console.log('Error in Branch Repository fetchUser method');

            console.log(error);

            throw error
        }
    }

    async update(data: IBranches, dbId: string, branchId: mongoose.Types.ObjectId) {
        try {
            const BranchModel = switchDb<IBranches>(`${process.env.SERVICE}_${dbId}`, 'branches')
            const res: IBranches | null = await BranchModel.findOneAndUpdate({ _id: branchId, is_deleted: false }, data, { new: true })
            return res

        } catch (error) {
            console.log('Error in Branch Repository create method');

            console.log(error);

            throw error
        }
    }

    async delete(dbId: string, branchId: mongoose.Types.ObjectId) {
        try {
            const BranchModel = switchDb<IBranches>(`${process.env.SERVICE}_${dbId}`, 'branches')
            const res: IBranches | null = await BranchModel.findOneAndUpdate({ _id: branchId }, { is_deleted: true }, { new: true })
            return res

        } catch (error) {
            console.log('Error in Branch Repository create method');

            console.log(error);

            throw error
        }
    }

    async fetchBranchByLocation(dbId: string, branchLocation: string) {
        try {
            const BranchModel = switchDb<IBranches>(`${process.env.SERVICE}_${dbId}`, 'branches')
            const res: IBranches | null = await BranchModel.findOne({ location: branchLocation })
            return res
        } catch (error) {
            console.log('Error in Branch Repository create method');

            console.log(error);

            throw error
        }
    }

    async fetchSpecificBranches(dbId: string, branchId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const BranchModel = switchDb<IBranches>(`${process.env.SERVICE}_${dbId}`, 'branches')
            const data = await BranchModel.findOne({ _id: branchId, is_deleted: false })
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in Branch Repository fetchUser method');

            console.log(error);

            throw error
        }
    }

    fetchBranchCount(dbId: string) {
        try {
            const BranchModel = switchDb<IBranches>(`${process.env.SERVICE}_${dbId}`, 'branches')
            return BranchModel.countDocuments()
        } catch (error) {
            console.log('Error in Branch Repository fetchUser method');

            console.log(error);

            throw error
        }
    }


}