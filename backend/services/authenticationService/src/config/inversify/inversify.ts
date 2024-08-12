import { Container } from "inversify";
import { IAdminRepository } from "../../repository/interface/IAdminRepository";
import AdminRepository from "../../repository/implementations/adminRepository";
import { IAdminService } from "../../services/interfaces/IAdminService";
import AdminService from "../../services/implementations/AdminService";
import IAdminController from "../../controllers/v1/interfaces/IAdminController";
import { AdminController } from "../../controllers/v1/implementations/AdminController";


const container = new Container();

container.bind<IAdminRepository>("IAdminRepository").to(AdminRepository);
container.bind<IAdminService>("IAdminService").to(AdminService);
container.bind<IAdminController>("IAdminController").to(AdminController);


export { container };