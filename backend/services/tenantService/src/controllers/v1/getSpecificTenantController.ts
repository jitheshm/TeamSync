import { Request, Response } from "express";
import { ITenantRepository } from "../../repository/interfaces/ITenantRepository";
import TenantRepository from "../../repository/implementations/TenantRepository";


let tenantRepository: ITenantRepository = new TenantRepository()

export default async (req: Request, res: Response) => {
    try {
        let tenantName = req.params.name
        if (!tenantName) {
            return res.status(400).json({ error: "Tenant name is required" })
        }
        const data = await tenantRepository.getTenantByName(tenantName)

        if (data) {
            res.status(200).json({ message: "Tenant fetched successfully", data: data })
        } else {
            res.status(404).json({ error: "Tenant not found" })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}