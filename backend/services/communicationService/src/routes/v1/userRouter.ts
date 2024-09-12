import { Router } from "express";
import userApiAuth from "../../middlewares/userApiAuth";
import tenantAuth from "../../middlewares/tenantAuth";
import { container } from "../../config/inversify/inversify";
import { IMeetingController } from "../../controllers/interfaces/IMeetingController";

const router = Router();

const meetingController = container.get<IMeetingController>("IMeetingController");

router.post('/meeting', userApiAuth, tenantAuth,
    (req, res, next) => meetingController.createMeeting(req, res, next));

router.get('/meetings', userApiAuth, tenantAuth,
    (req, res, next) => meetingController.fetchMeetings(req, res, next)
)

export default router
