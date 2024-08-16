import { inject, injectable } from "inversify";
import { IPlanController } from "../interfaces/IPlanController";
import { CustomError, CustomRequest } from "teamsync-common";
import { NextFunction, Response } from "express";
import { IPlanService } from "../../../services/interfaces/IPlanService";
import mongoose from "mongoose";

@injectable()
export class PlanController implements IPlanController {
    private planService: IPlanService;

    constructor(
        @inject("IPlanService") planService: IPlanService
    ) {
        this.planService = planService
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
}