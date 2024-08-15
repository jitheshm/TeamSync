import mongoose, { Document } from "mongoose";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { ITodoRepository } from "../../repository/interfaces/ITodoRepository";
import { ITodo } from "../../entities/TodoEntity";
import { ITodoService } from "../interfaces/ITodoService";
import { inject, injectable } from "inversify";

@injectable()
export default class TodoService implements ITodoService {

    private todoRepostitory: ITodoRepository;

    constructor(
        @inject("ITodoRepository") todoRepository: ITodoRepository
    ) {
        this.todoRepostitory = todoRepository;
    }

    async createTodo(data: Partial<ITodo>, dbId: string): Promise<ITodo & Document> {
        return await this.todoRepostitory.create(data, dbId);

    }
    async fetchTodoList(dbId: string, userId: mongoose.Types.ObjectId): Promise<(ITodo & Document)[]> {
        return await this.todoRepostitory.fetchTodo(dbId, userId);
    }

    async updateTodo(data: Partial<ITodo>, dbId: string, todoId: mongoose.Types.ObjectId): Promise<ITodo | null> {
        return await this.todoRepostitory.update(data, dbId, todoId);
    }

} 