
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import { IProjects } from "../../entities/ProjectEntity";
import { IProjectRepository } from "../interfaces/IProjectRepository";




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
            const data = await ProjectModel.findOne({ _id: projectId, branch_id: branchId, is_deleted: false })
            console.log(data);

            return data
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

    async fetchAllProject(dbId: string, branchId: mongoose.Types.ObjectId) {
        try {
            console.log(dbId);

            const ProjectModel = switchDb<IProjects>(`${process.env.SERVICE}_${dbId}`, 'projects')
            const data = await ProjectModel.find({ branch_id: branchId, is_deleted: false })
            console.log(data);

            return data
        } catch (error) {
            console.log('Error in project Repository fetch method');

            console.log(error);

            throw error
        }
    }



}

