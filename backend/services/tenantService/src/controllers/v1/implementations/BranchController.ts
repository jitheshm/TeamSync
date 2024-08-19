import { NextFunction, Response } from "express";
import { CustomRequest } from "teamsync-common";
import { IBranchService } from "../../../services/interfaces/IBranchService";
import { inject, injectable } from "inversify";
import { IBranchController } from "../interfaces/IBranchController";
import mongoose from "mongoose";

@injectable()
export class BranchController implements IBranchController {

    private branchService: IBranchService
    constructor(
        @inject("IBranchService") branchService: IBranchService
    ) {
        this.branchService = branchService
    }

    async createBranch(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            const tenantId = req.user?.decode?.tenantId
            const body = req.body

            await this.branchService.createBranch(tenantId, body)
            res.status(201).json({ message: "branch created successfully" });



        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async deleteBranch(req: CustomRequest, res: Response, next: NextFunction) {
        try {


            const tenantId = req.user?.decode?.tenantId
            const branchId = new mongoose.Types.ObjectId(req.params.branchId)
            await this.branchService.deleteBranch(tenantId,branchId)

            res.status(201).json({ message: "branch delete successfully" });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }
}