import { Container } from "inversify";
import MeetingRepository from "../../repository/implementations/MeetingRepository";
import { IMeetingService } from "../../services/interfaces/IMeetingService";
import MeetingService from "../../services/implementations/MeetingService";
import { IMeetingRepository } from "../../repository/interfaces/IMeetingRepository";
import { IMeetingController } from "../../controllers/interfaces/IMeetingController";
import { MeetingController } from "../../controllers/implementations/MeetingController";
import { IKafkaConnection } from "teamsync-common";
import { KafkaConnection } from "../kafka/KafkaConnection";



const container = new Container();

container.bind<IMeetingRepository>("IMeetingRepository").to(MeetingRepository);
container.bind<IMeetingService>("IMeetingService").to(MeetingService);
container.bind<IMeetingController>("IMeetingController").to(MeetingController);
container.bind<IKafkaConnection>("IKafkaConnection").to(KafkaConnection);








export { container };