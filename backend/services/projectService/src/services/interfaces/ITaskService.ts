import { ITasks } from "../../entities/TaskEntity";
import IDecodedUser from "../../interfaces/IDecodeUser";


export interface ITaskService {
    createTask(user: IDecodedUser, body: Partial<ITasks>, projectId: string): Promise<ITasks>;
}
