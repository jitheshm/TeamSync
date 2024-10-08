import { inject, injectable } from "inversify";
import { IPlanRepository } from "../../repository/interfaces/IPlanRepository";
import { IPlanService } from "../interfaces/IPlanService";
import mongoose from "mongoose";
import IPlan from "../../entities/PlanEntity";
import Stripe from "stripe";
import { CustomError, IKafkaConnection, IProducer } from "teamsync-common";
import { Producer } from "kafkajs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

@injectable()
export class PlanService implements IPlanService {
    private planRepository: IPlanRepository
    private kafkaConnection: IKafkaConnection
    private createPlanProducer: (producer: Producer, dbName: string, modelName: string) => IProducer<Partial<IPlan>>;


    constructor(
        @inject("IPlanRepository") planRepository: IPlanRepository,
        @inject("IKafkaConnection") kafkaConnection: IKafkaConnection,
        @inject("IPlanProducer") createPlanProducer: (producer: Producer, dbName: string, modelName: string) => IProducer<Partial<IPlan>>
    ) {
        this.planRepository = planRepository
        this.kafkaConnection = kafkaConnection
        this.createPlanProducer = createPlanProducer
    }

    async createStripePlan(plan: IPlan) {
        const stripePlan = await stripe.plans.create({
            amount: Number(plan.price) * 100,
            interval: plan.bill_cycle,
            product: {
                name: plan.name,
            },
            currency: 'usd',
        });
        console.log(stripePlan);

        return stripePlan.id

    }

    async createPlan(bodyObj: IPlan) {
        const stripePlanId = await this.createStripePlan(bodyObj)
        bodyObj.stripe_plan_id = stripePlanId as string
        const planObj = await this.planRepository.create(bodyObj);

        let producer = await this.kafkaConnection.getProducerInstance()
        let planProducer = this.createPlanProducer(producer, 'main', 'plans')
        planProducer.sendMessage('create', planObj)
    }



    async deletePlan(id: mongoose.Types.ObjectId) {
        let resObj = await this.planRepository.update({ is_deleted: true }, id);
        return resObj;
    }

    async fetchAllPlan(page: string | null, limit: string | null, name: string | null) {
        let data
        if (page && limit) {
            data = await this.planRepository.fetchAll(Number(page), Number(limit), name as string | null);

        } else
            data = await this.planRepository.fetchAll(1, 100, null);
        return data
    }

    async getAvailablePlans(page: string | null, limit: string | null, name: string | null) {
        let data
        if (page && limit) {
            data = await this.planRepository.fetchAvailablePlans(Number(page), Number(limit), name as string | null);

        } else
            data = await this.planRepository.fetchAvailablePlans(1, 100, null);
        return data
    }

    async getSpecificPlan(planId: mongoose.Types.ObjectId) {
        const plans = await this.planRepository.fetchById(planId)
        return plans
    }

    async updatePlan(bodyObj: Partial<IPlan>, planId: string) {
        const { price, currency, bill_cycle, ...dataObj } = bodyObj

        const id = new mongoose.Types.ObjectId(planId);
        let resObj = await this.planRepository.update(dataObj, id);
        if (!resObj)
            throw new CustomError("Plan not found", 404);

        let producer = await this.kafkaConnection.getProducerInstance()
        let planProducer = this.createPlanProducer(producer, 'main', 'plans')
        planProducer.sendMessage('update', resObj)
    }
}