
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

    
}

