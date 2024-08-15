import mongoose from "mongoose";
import IDecodedUser from "../../interfaces/IDecodeUser";
import { ITicketRepository } from "../../repository/interfaces/ITicketRepository";
import { ITickets } from "../../entities/TicketEntity";
import { ITicketService } from "../interfaces/ITicketService";
import { IKafkaConnection } from "../../interfaces/IKafkaConnection";
import TicketProducer from "../../events/kafka/producers/TicketProducer";
import { ITaskRepository } from "../../repository/interfaces/ITaskRepository";
import { inject, injectable } from "inversify";

@injectable()
export default class TicketService implements ITicketService {

    private ticketRepostitory: ITicketRepository;
    private kafkaConnection?: IKafkaConnection;
    private taskRepository?: ITaskRepository


    constructor(
        @inject("ITicketRepository") ticketRepository: ITicketRepository,
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("ITaskRepository") taskRepository: ITaskRepository
    ) {
        this.ticketRepostitory = ticketRepository;
        this.kafkaConnection = kafkaConnection;
        this.taskRepository = taskRepository;
    }

    async createTicket(user: IDecodedUser, body: Partial<ITickets>, projectId: string, taskId: string): Promise<ITickets> {

        body.ticket_id = '#ticket' + new Date().getTime() + Math.floor(Math.random() * 1000);
        body.project_id = new mongoose.Types.ObjectId(projectId);
        body.task_id = new mongoose.Types.ObjectId(taskId);

        const newTicket = await this.ticketRepostitory.create(body as ITickets, user.decode?.tenantId);
        const task = await this.taskRepository?.fetchSpecificTaskById(user.decode?.tenantId, newTicket.task_id);

        const producer = await this.kafkaConnection?.getProducerInstance();
        const tenantTicketProducer = new TicketProducer(producer!, user.decode?.tenantId, 'tickets');
        tenantTicketProducer.sendMessage('create', { newTicket, developer_id: task!.developer_id });
        return newTicket
    }
    async updateTicket(ticketId: string, bodyObj: Partial<ITickets>, tenantId: string): Promise<ITickets | null> {
        try {
            const resultObj = await this.ticketRepostitory.update(bodyObj, tenantId, new mongoose.Types.ObjectId(ticketId));
            return resultObj;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async updateStatus(ticketId: string, bodyObj: Partial<ITickets>, tenantId: string): Promise<ITickets | null> {
        try {
            const resultObj = await this.ticketRepostitory.updateStatus(bodyObj, tenantId, new mongoose.Types.ObjectId(ticketId));
            return resultObj;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async deleteTicket(taskId: mongoose.Types.ObjectId, tenantId: string): Promise<boolean> {
        try {
            const result = await this.ticketRepostitory.delete(tenantId, taskId);
            return !!result;
        } catch (error) {
            console.log(error);
            throw new Error("An unexpected error occurred. Please try again later.");
        }
    }

    async fetchTaskAllTickets(tenantId: string, taskId: mongoose.Types.ObjectId, search: string | null, page: number, limit: number): Promise<{ data: (ITickets & mongoose.Document)[], totalCount: number }> {
        return await this.ticketRepostitory.fetchTaskAllTickets(tenantId, taskId, search, page, limit);
    }

    async fetchSpecificTicketDetails(tenantId: string, ticketId: mongoose.Types.ObjectId): Promise<ITickets | null> {
        return await this.ticketRepostitory.fetchSpecificTicketDetails(tenantId, ticketId);
    }
    async fetchTicketStats(tenantId: string, branchId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<(any)[]> {
        return await this.ticketRepostitory.fetchTicketStats(tenantId, branchId, userId);
    }

} 