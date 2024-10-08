
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import { IBranchRepository } from "../interface/IBranchRepository";
import { IBranches } from "../../entities/BranchEntity";
import { injectable } from "inversify";




@injectable()
export default class BranchRepository implements IBranchRepository {

    async create(data: IBranches, dbId: string) {
        try {
            const BranchModel = switchDb<IBranches>(`${process.env.SERVICE}_${dbId}`, 'branches')
            const newBranch = new BranchModel(data)
            await newBranch.save()
            return
        } catch (error) {
            console.log('Error in Branch Repository create method');

            console.log(error);

            throw error
        }
    }
    async fetchBranches(dbId: string) {
        try {
            console.log(dbId);

            const BranchModel = switchDb<IBranches>(`${process.env.SERVICE}_${dbId}`, 'branches')
            const data = await BranchModel.find({ is_deleted: false })
            console.log(data);

            return data
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

    async fetchBranchById(dbId: string, branchId: mongoose.Types.ObjectId) {
        try {
            const BranchModel = switchDb<IBranches>(`${process.env.SERVICE}_${dbId}`, 'branches')
            const res: IBranches | null = await BranchModel.findOne({ _id: branchId, is_deleted: false })
            return res
        } catch (error) {
            console.log('Error in Branch Repository create method');

            console.log(error);

            throw error
        }
    }


}