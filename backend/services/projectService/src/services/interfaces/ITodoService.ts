import mongoose, { Document } from "mongoose";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { ITodo } from "../../entities/TodoEntity";


export interface ITodoService {
    createTodo(data: Partial<ITodo>, dbId: string): Promise<ITodo & Document>
    fetchTodoList(dbId: string, userId: mongoose.Types.ObjectId): Promise<(ITodo & Document)[]>
    updateTodo(data: Partial<ITodo>, dbId: string, todoId: mongoose.Types.ObjectId): Promise<ITodo | null>

}
