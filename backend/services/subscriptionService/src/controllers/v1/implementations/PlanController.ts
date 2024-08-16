import { inject, injectable } from "inversify";
import { IPlanController } from "../interfaces/IPlanController";
import { CustomError, CustomRequest } from "teamsync-common";
import { NextFunction, Response } from "express";
import { IPlanService } from "../../../services/interfaces/IPlanService";
import mongoose from "mongoose";
import IPlan from "../../../entities/PlanEntity";


@injectable()
export class PlanController implements IPlanController {
    private planService: IPlanService;

    constructor(
        @inject("IPlanService") planService: IPlanService
    ) {
        this.planService = planService
    }

    async createPlan(req: CustomRequest, res: Response, next: NextFunction) {
        try {


            const bodyObj: IPlan = req.body;
            bodyObj.plan_id = '#plan' + new Date().getTime() + Math.floor(Math.random() * 1000)
            await this.planService.createPlan(bodyObj);
            res.status(201).json({ message: "Plan created successfully" });


        } catch (error) {
            console.log(error)
            next(error)
        }
    }



    async deletePlan(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const id = new mongoose.Types.ObjectId(req.params.planId);
            let resObj = await this.planService.deletePlan(id);
            if (!resObj)
                throw new CustomError("Plan not found", 404);

            res.status(200).json({ message: "Plan deleted successfully" });

        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async fetchAllPlans(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { name, page, limit } = req.query
            const data = await this.planService.fetchAllPlan(page as string | null, limit as string | null, name as string | null);
            res.status(200).json({ data: data });

        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async getAvailablePlans(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { name, page, limit } = req.query
            const data = await this.planService.getAvailablePlans(page as string | null, limit as string | null, name as string | null);

            res.status(200).json({ data: data });

        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async getSpecificPlan(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const planId = new mongoose.Types.ObjectId(req.params.planId);
            const plans = await this.planService.getSpecificPlan(planId)
            if (plans) {
                res.status(200).json({ data: plans })
            }
            else {
                throw new CustomError("Plan not found", 404)
            }

        } catch (error) {
            console.log(error)
            next(error)
        }
    }



}