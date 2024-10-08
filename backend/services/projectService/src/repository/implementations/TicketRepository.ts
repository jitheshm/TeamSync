
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import { ITickets } from "../../entities/TicketEntity";
import { ITicketRepository } from "../interfaces/ITicketRepository";
import { injectable } from "inversify";




@injectable()
export default class TicketRepository implements ITicketRepository {

    async create(data: ITickets, dbId: string) {
        try {
            const TicketModel = switchDb<ITickets>(`${process.env.SERVICE}_${dbId}`, 'tickets')
            const newTicket = new TicketModel(data)
            await newTicket.save()
            return newTicket
        } catch (error) {
            console.log('Error in Ticket Repository create method');

            console.log(error);

            throw error
        }
    }


    async fetchSpecificTicket(dbId: string, ticketId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const TicketModel = switchDb<ITickets>(`${process.env.SERVICE}_${dbId}`, 'tickets')
            const data = await TicketModel.findOne({ _id: ticketId, is_deleted: false })
            console.log(data);
            return data

        } catch (error) {
            console.log('Error in Ticket Repository fetch method');

            console.log(error);

            throw error
        }
    }


    async update(data: Partial<ITickets>, dbId: string, ticketId: mongoose.Types.ObjectId) {
        try {
            const TicketModel = switchDb<ITickets>(`${process.env.SERVICE}_${dbId}`, 'tickets')

            const result = await TicketModel.findOne({ _id: ticketId, is_deleted: false })
            if (result) {
                

                const res: ITickets | null = await TicketModel.findOneAndUpdate({ _id: ticketId, is_deleted: false }, data, { new: true })
                return res
            }
            return null

        } catch (error) {
            console.log('Error in Ticket Repository update method');

            console.log(error);

            throw error
        }
    }

    async delete(dbId: string, ticketId: mongoose.Types.ObjectId) {
        try {
            const TicketModel = switchDb<ITickets>(`${process.env.SERVICE}_${dbId}`, 'tickets')
            const res: ITickets | null = await TicketModel.findOneAndUpdate({ _id: ticketId }, { is_deleted: true }, { new: true })
            return res

        } catch (error) {
            console.log('Error in  Ticket Repository create method');

            console.log(error);

            throw error
        }
    }

    async fetchTaskAllTickets(
        dbId: string,
        taskId: mongoose.Types.ObjectId,
        search: string | null,
        page: number,
        limit: number
    ) {
        try {
            console.log(dbId);

            const TicketModel = switchDb<ITickets>(`${process.env.SERVICE}_${dbId}`, 'tickets');

            const pipeline: any[] = [
                {
                    $match: {
                        task_id: taskId,
                        is_deleted: false
                    }
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project_id',
                        foreignField: '_id',
                        as: 'projects'
                    }
                },
                {
                    $unwind: "$projects"
                }
                ,
                {
                    $lookup: {
                        from: 'tasks',
                        localField: 'task_id',
                        foreignField: '_id',
                        as: 'tasks'
                    }
                },
                {
                    $unwind: "$tasks"
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'tasks.developer_id',
                        foreignField: '_id',
                        as: 'developer'
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'tasks.tester_id',
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

            const result = await TicketModel.aggregate(pipeline);

            const totalCount = result[0]?.totalCount || 0;
            const data = result[0]?.data || [];

            console.log(data);

            return { totalCount, data };
        } catch (error) {
            console.log('Error in ticket Repository fetch method');
            console.log(error);
            throw error;
        }
    }


    async fetchSpecificTicketDetails(dbId: string, ticketId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const TicketModel = switchDb<ITickets>(`${process.env.SERVICE}_${dbId}`, 'tickets')
            const data = await TicketModel.aggregate([
                {
                    $match: {
                        _id: ticketId,
                    }
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project_id',
                        foreignField: '_id',
                        as: 'projects'
                    }
                },
                {
                    $unwind: "$projects"
                },
                {
                    $lookup: {
                        from: 'tasks',
                        localField: 'task_id',
                        foreignField: '_id',
                        as: 'tasks'
                    }
                },
                {
                    $unwind: "$tasks"
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'tasks.developer_id',
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
                        localField: 'tasks.tester_id',
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

    async updateStatus(bodyObj: Partial<ITickets>, tenantId: string, ticketId: mongoose.Types.ObjectId) {
        try {
            const TicketModel = switchDb<ITickets>(`${process.env.SERVICE}_${tenantId}`, 'tickets')
            const res: ITickets | null = await TicketModel.findOneAndUpdate({ _id: ticketId, is_deleted: false }, bodyObj, { new: true })
            return res
        } catch (error) {
            console.log('Error in Ticket Repository updateStatus method');

            console.log(error);

            throw error
        }
    }


    async fetchTicketStats(dbId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
        try {
            console.log(userId, "userId");

            const TicketModel = switchDb<ITickets>(`${process.env.SERVICE}_${dbId}`, 'tickets')
            const data = await TicketModel.aggregate([
                {
                    $match: {
                        is_deleted: false,


                    }
                },
                {
                    $lookup: {
                        from: "tasks",
                        localField: "task_id",
                        foreignField: "_id",
                        as: "task"
                    }
                },
                {
                    $unwind: "$task"
                },
                {
                    $match: {
                        "task.branch_id": branchId
                    }
                },
                {
                    $match: {
                        $or: [
                            {
                                "task.developer_id": userId
                            },
                            {
                                "task.tester_id": userId
                            }
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
                    $match: {
                        _id: { $ne: 'closed' }
                    }
                },
                {
                    $project: {
                        status: "$_id",
                        count: 1,
                        _id: 0
                    }
                }

            ]).exec();
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in Ticket Repository fetch method');

            console.log(error);

            throw error
        }
    }




}

