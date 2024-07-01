
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


}