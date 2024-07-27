import mongoose, { Document, ObjectId, UpdateWriteOpResult } from "mongoose";
import { ITodo } from "../../entities/TodoEntity";


export interface ITodoRepository {
    create(data: Partial<ITodo>, dbId: string): Promise<ITodo & Document>
    fetchTodo(dbId: string, userId: mongoose.Types.ObjectId): Promise<(ITodo & Document)[]>
    update(data: Partial<ITodo>, dbId: string, todoId: mongoose.Types.ObjectId): Promise<ITodo | null>



}