
import mongoose, { ObjectId } from "mongoose";
import switchDb from "../../utils/switchDb";
import { ITodo } from "../../entities/TodoEntity";
import { ITodoRepository } from "../interfaces/ITodoRepository";




export default class TodoRepository implements ITodoRepository {

    async create(data: Partial<ITodo>, dbId: string) {
        try {
            const TodoModel = switchDb<ITodo>(`${process.env.SERVICE}_${dbId}`, 'todo')
            const newTodo = new TodoModel(data)
            await newTodo.save()
            return newTodo
        } catch (error) {
            console.log('Error in Todo Repository create method');

            console.log(error);

            throw error
        }
    }

    async fetchTodo(dbId: string, userId: mongoose.Types.ObjectId) {
        try {
            const TodoModel = switchDb<ITodo>(`${process.env.SERVICE}_${dbId}`, 'todo')
            const todo = await TodoModel.find({ user_id: userId, is_deleted: false })
            return todo
        } catch (error) {
            console.log('Error in Todo Repository fetchSpecificTask method');

            console.log(error);

            throw error
        }
    }

    async update(data: Partial<ITodo>, dbId: string, todoId: mongoose.Types.ObjectId) {
        try {
            const TodoModel = switchDb<ITodo>(`${process.env.SERVICE}_${dbId}`, 'todo')
            const todo = await TodoModel.findOneAndUpdate({ _id: todoId, is_deleted: false }, data)
            return todo
        } catch (error) {
            console.log('Error in Todo Repository update method');

            console.log(error);

            throw error
        }
    }







}

