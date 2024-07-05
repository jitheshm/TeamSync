import { Router } from "express";




const router = Router();

router.get('/', () => {
    console.log("Hello")
})



export default router