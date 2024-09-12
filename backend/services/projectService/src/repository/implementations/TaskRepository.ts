
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import { ITasks } from "../../entities/TaskEntity";
import { ITaskRepository } from "../interfaces/ITaskRepository";
import { injectable } from "inversify";



@injectable()
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

    async fetchProjectAllTask(
        dbId: string,
        branchId: mongoose.Types.ObjectId,
        projectId: mongoose.Types.ObjectId,
        search: string | null,
        page: number,
        limit: number
    ) {
        try {
            console.log(dbId);

            const TaskModel = switchDb<ITasks>(`${process.env.SERVICE}_${dbId}`, 'tasks');

            const pipeline: any[] = [
                {
                    $match: {
                        project_id: projectId,
                        branch_id: branchId,
                        is_deleted: false
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'developer_id',
                        foreignField: '_id',
                        as: 'developer'
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'tester_id',
                        foreignField: '_id',
                        as: 'tester'
                    }
                },
            ];

            if (search) {
                pipeline.push({
                    $match: {
                        title: { $regex: search, $options: 'i' } // Case-insensitive search
                    }
                });
            }

            const facetPipeline = [
                {
                    $facet: {
                        totalCount: [
                            { $count: "count" }
                        ],
                        data: [
                            { $skip: (page - 1) * limit },
                            { $limit: limit }
                        ]
                    }
                },
                {
                    $unwind: "$totalCount"
                },
                {
                    $project: {
                        totalCount: "$totalCount.count",
                        data: 1
                    }
                }
            ];

            pipeline.push(...facetPipeline);

            const result = await TaskModel.aggregate(pipeline);

            const totalCount = result[0]?.totalCount || 0;
            const data = result[0]?.data || [];

            console.log(data);

            return { totalCount, data };
        } catch (error) {
            console.log('Error in Task Repository fetch method');
            console.log(error);
            throw error;
        }
    }


    async fetchSpecificTaskDetails(dbId: string, taskId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const TaskModel = switchDb<ITasks>(`${process.env.SERVICE}_${dbId}`, 'tasks')
            const data = await TaskModel.aggregate([
                {
                    $match: {
                        _id: taskId,
                        branch_id: branchId,
                        is_deleted: false
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'developer_id',
                        foreignField: '_id',
                        as: 'developer'
                    }
                },
                // {
                //     $unwind: "$developer"
                // },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'tester_id',
                        foreignField: '_id',
                        as: 'tester'
                    }
                },
                // {
                //     $unwind: "$tester"
                // },


            ]).exec();
            console.log(data);

            return data[0]
        } catch (error) {
            console.log('Error in project Repository fetch method');

            console.log(error);

            throw error
        }
    }


    async fetchTaskStats(dbId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<{ status: string, count: number }[]> {
        try {
            const TaskModel = switchDb<ITasks>(`${process.env.SERVICE}_${dbId}`, 'tasks')

            const data = await TaskModel.aggregate([
                {
                    $match: {
                        branch_id: branchId
                    }
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project_id',
                        foreignField: '_id',
                        as: 'project'
                    }
                },
                {
                    $unwind: "$project"
                },
                {
                    $match: {

                        $or: [
                            { developer_id: userId },
                            { tester_id: userId },
                            { "project.project_manager_id": userId }
                        ]
                    }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        status: "$_id",
                        count: 1
                    }
                }
            ])
            return data
        } catch (error) {
            throw error
        }

    }

    async fetchSpecificTaskById(dbId: string, taskId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const TaskModel = switchDb<ITasks>(`${process.env.SERVICE}_${dbId}`, 'tasks')
            const data = await TaskModel.findOne({ _id: taskId, is_deleted: false })
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in Task Repository fetch method');

            console.log(error);

            throw error
        }
    }
    


}

