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
            await this.branchService.deleteBranch(tenantId, branchId)

            res.status(201).json({ message: "branch delete successfully" });

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    async getAllBranches(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            const tenantId = req.user?.decode?.tenantId;
            const name = req.query.name as string | null
            const page = Number(req.query.page || 1)
            const limit = Number(req.query.limit || 1000)
            const datas = await this.branchService.getAllBranches(tenantId, name, page, limit)
            res.status(201).json({ message: "succesfully fetched", data: datas });


        } catch (error) {
            console.log(error);
            next(error)

        }
    }
}