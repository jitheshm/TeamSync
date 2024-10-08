
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import { IProjects } from "../../entities/ProjectEntity";
import { IProjectRepository } from "../interfaces/IProjectRepository";
import { injectable } from "inversify";



@injectable()
export default class ProjectRepository implements IProjectRepository {

    async create(data: IProjects, dbId: string) {
        try {
            const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects')
            const newProject = new ProjectModel(data)
            await newProject.save()
            return newProject
        } catch (error) {
            console.log('Error in project Repository create method');

            console.log(error);

            throw error
        }
    }


    async fetchSpecificProject(dbId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects')
            const data = await ProjectModel.aggregate([
                {
                    $match: {
                        _id: projectId,
                        branch_id: branchId,

                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'developers_id',
                        foreignField: '_id',
                        as: 'developers'
                    }
                },


                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'testers_id',
                        foreignField: '_id',
                        as: 'testers'
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'project_manager_id',
                        foreignField: '_id',
                        as: 'project_manager'
                    }
                }

            ])
            console.log(data);

            return data[0]
        } catch (error) {
            console.log('Error in project Repository fetch method');

            console.log(error);

            throw error
        }
    }


    async update(data: IProjects, dbId: string, projectId: mongoose.Types.ObjectId) {
        try {
            const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects')
            const res: IProjects | null = await ProjectModel.findOneAndUpdate({ _id: projectId, branch_id: data.branch_id, is_deleted: false }, data, { new: true })
            return res

        } catch (error) {
            console.log('Error in tenant project Repository update method');

            console.log(error);

            throw error
        }
    }

    async delete(data: Partial<IProjects>, dbId: string, projectId: mongoose.Types.ObjectId) {
        try {
            const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects')
            const res: IProjects | null = await ProjectModel.findOneAndUpdate({ _id: projectId, branch_id: data.branch_id }, { is_deleted: true }, { new: true })
            return res

        } catch (error) {
            console.log('Error in tenant project Repository create method');

            console.log(error);

            throw error
        }
    }

    async fetchAllProject(dbId: string, branchId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number) {
        try {
            console.log(dbId);

            const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects');

            const query: any = { branch_id: branchId, is_deleted: false };
            if (search) {
                query.name = { $regex: `^${search}`, $options: 'i' };
            }

            const data = await ProjectModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit);

            const totalCount = await ProjectModel.countDocuments(query);

            console.log(data);

            return { data, totalCount };
        } catch (error) {
            console.log('Error in project Repository fetch method');
            console.log(error);
            throw error;
        }
    }


    async fetchSpecificProjectDetails(dbId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects')
            const data = await ProjectModel.aggregate([
                {
                    $match: {
                        _id: projectId,
                        branch_id: branchId,
                        is_deleted: false
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'manager_id',
                        foreignField: '_id',
                        as: 'manager'
                    }
                },
                {
                    $unwind: {
                        path: '$developers_id',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'developers_id',
                        foreignField: '_id',
                        as: 'developer_details'
                    }
                },
                {
                    $unwind: {
                        path: '$testers_id',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'testers_id',
                        foreignField: '_id',
                        as: 'tester_details'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        name: { $first: '$name' },
                        description: { $first: '$description' },
                        project_id: { $first: '$project_id' },
                        start_date: { $first: '$start_date' },
                        end_date: { $first: '$end_date' },
                        stage: { $first: '$stage' },
                        client_name: { $first: '$client_name' },
                        created_at: { $first: '$created_at' },
                        branch_id: { $first: '$branch_id' },
                        manager: { $first: '$manager' },
                        developer: { $push: { $arrayElemAt: ['$developer_details', 0] } },
                        tester: { $push: { $arrayElemAt: ['$tester_details', 0] } },
                        project_manager_id: { $first: '$project_manager_id' },
                        is_deleted: { $first: '$is_deleted' }
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'project_manager_id',
                        foreignField: '_id',
                        as: 'project_manager'
                    }
                }
            ]).exec();
            console.log(data);

            return data[0]
        } catch (error) {
            console.log('Error in project Repository fetch method');

            console.log(error);

            throw error
        }
    }

    async fetchAllPManagerProjects(dbId: string, branchId: mongoose.Types.ObjectId, pManagerId: mongoose.Types.ObjectId, search: string, page: number, limit: number) {
        try {
            console.log(dbId);

            const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects');

            const query: any = { branch_id: branchId, project_manager_id: pManagerId, is_deleted: false };
            if (search) {
                query.name = { $regex: `^${search}`, $options: 'i' };
            }

            const data = await ProjectModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit);

            // Get the total count for pagination purposes
            const totalCount = await ProjectModel.countDocuments(query);

            console.log(data);

            return { data, totalCount };
        } catch (error) {
            console.log('Error in project Repository fetch method');
            console.log(error);
            throw error;
        }
    }

    async fetchAllDeveloperProjects(dbId: string, branchId: mongoose.Types.ObjectId, developerId: mongoose.Types.ObjectId, search: string, page: number, limit: number) {
        try {
            console.log(dbId);

            const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects');

            const query: any = { branch_id: branchId, developers_id: developerId, is_deleted: false };
            if (search) {
                query.name = { $regex: `^${search}`, $options: 'i' };
            }

            const data = await ProjectModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit);

            // Get the total count for pagination purposes
            const totalCount = await ProjectModel.countDocuments(query);

            console.log(data);

            return { data, totalCount };
        } catch (error) {
            console.log('Error in project Repository fetch method');
            console.log(error);
            throw error;
        }
    }

    async fetchAllTesterProjects(dbId: string, branchId: mongoose.Types.ObjectId, testerId: mongoose.Types.ObjectId, search: string, page: number, limit: number) {
        try {
            console.log(dbId);

            const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects');

            const query: any = { branch_id: branchId, testers_id: testerId, is_deleted: false };
            if (search) {
                query.name = { $regex: `^${search}`, $options: 'i' };
            }

            const data = await ProjectModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit);

            // Get the total count for pagination purposes
            const totalCount = await ProjectModel.countDocuments(query);

            console.log(data);

            return { data, totalCount };
        } catch (error) {
            console.log('Error in project Repository fetch method');
            console.log(error);
            throw error;
        }
    }

    async fetchProjectUsers(dbId: string, projectId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects')
            const data = await ProjectModel.aggregate([
                {
                    $match: {
                        _id: projectId,
                        branch_id: branchId,
                        is_deleted: false
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'developers_id',
                        foreignField: '_id',
                        as: 'developers'
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'testers_id',
                        foreignField: '_id',
                        as: 'testers'
                    }
                },
                {
                    $lookup: {
                        from: 'tenant_users',
                        localField: 'project_manager_id',
                        foreignField: '_id',
                        as: 'project_manager'
                    }
                },
                {
                    $project: {
                        developers: 1,
                        testers: 1,
                        project_manager: 1,
                        _id: 0
                    }

                }

            ])
            console.log(data);

            return data[0]
        } catch (error) {
            console.log('Error in project Repository fetch method');

            console.log(error);

            throw error
        }
    }

    async fetchRecentProjects(
        dbId: string,
        branchId?: mongoose.Types.ObjectId,
        pmId?: mongoose.Types.ObjectId
    ) {
        const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects');

        // Build the query object
        const query: any = {};
        if (pmId) {
            query.project_manager_id = pmId;
        }
        if (branchId) {
            query.branch_id = branchId
        }

        const projects = await ProjectModel.find(query)
            .sort({ created_at: -1 })
            .limit(10);

        return projects;
    }


    async fetchProjectStats(dbId: string, branchId: mongoose.Types.ObjectId) {
        const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects')

        const stats = await ProjectModel.aggregate([
            {
                $match: { is_deleted: false, branch_id: branchId }
            },
            {
                $group: {
                    _id: "$stage",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    stage: "$_id",
                    count: 1
                }
            }
        ]);
        return stats
    }

    async fetchBranchProjectsCount(dbId: string, startDate: Date) {
        const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects');



        const stats = await ProjectModel.aggregate([
            {
                $match: {
                    is_deleted: false,
                    created_at: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: "$branch_id",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'branches',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'branch'
                }
            },
            {
                $unwind: "$branch"
            },
            {
                $project: {
                    _id: 0,
                    branchName: "$branch.location",
                    count: 1
                }
            }
        ]);

        return stats;
    }




}

