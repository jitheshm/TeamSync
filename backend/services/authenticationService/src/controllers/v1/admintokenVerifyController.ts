import { Request, Response } from "express";


export default (req: Request & Partial<{ user: { name: string } }>, res: Response) => {
    try {
        res.status(200).json({ message: "Token verified", user: req.user?.name });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
}