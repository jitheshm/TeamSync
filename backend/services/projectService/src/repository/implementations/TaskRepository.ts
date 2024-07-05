
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import { ITasks } from "../../entities/TaskEntity";
import { ITaskRepository } from "../interfaces/ITaskRepository";




export default class TaskRepository implements ITaskRepository {

    async create(data: ITasks, dbId: string) {
        try {
            const TaskModel = switchDb<ITasks>(`${process.env.SERVICE}_${dbId}`, 'tasks')
            const newTask = new TaskModel(data)
            await newTask.save()
            return newTask
        } catch (error) {
            console.log('Error in Task Repository create method');

            console.log(error);

            throw error
        }
    }


    async fetchSpecificTask(dbId: string, taskId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const TaskModel = switchDb<ITasks>(`${process.env.SERVICE}_${dbId}`, 'tasks')
            const data = await TaskModel.findOne({ _id: taskId, branch_id: branchId, is_deleted: false })
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in Task Repository fetch method');

            console.log(error);

            throw error
        }
    }


    async update(data: ITasks, dbId: string, taskId: mongoose.Types.ObjectId) {
        try {
            const TaskModel = switchDb<ITasks>(`${process.env.SERVICE}_${dbId}`, 'tasks')
            const res: ITasks | null = await TaskModel.findOneAndUpdate({ _id: taskId, branch_id: data.branch_id, is_deleted: false }, data, { new: true })
            return res

        } catch (error) {
            console.log('Error in tenant Task Repository update method');

            console.log(error);

            throw error
        }
    }

    async delete(data: Partial<ITasks>, dbId: string, taskId: mongoose.Types.ObjectId) {
        try {
            const TaskModel = switchDb<ITasks>(`${process.env.SERVICE}_${dbId}`, 'tasks')
            const res: ITasks | null = await TaskModel.findOneAndUpdate({ _id: taskId, branch_id: data.branch_id }, { is_deleted: true }, { new: true })
            return res

        } catch (error) {
            console.log('Error in tenant Task Repository create method');

            console.log(error);

            throw error
        }
    }

    async fetchAllTask(dbId: string, branchId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const TaskModel = switchDb<ITasks>(`${process.env.SERVICE}_${dbId}`, 'tasks')
            const data = await TaskModel.find({ branch_id: branchId, is_deleted: false })
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in Task Repository fetch method');

            console.log(error);

            throw error
        }
    }


    

    

}

