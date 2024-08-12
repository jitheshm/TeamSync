import { Container } from "inversify";
import { IAdminRepository } from "../../repository/interface/IAdminRepository";
import AdminRepository from "../../repository/implementations/adminRepository";
import "reflect-metadata";
import { IAdminService } from "../../services/interfaces/IAdminService";
import AdminService from "../../services/implementations/AdminService";


const container = new Container();

container.bind<IAdminRepository>("IAdminRepository").to(AdminRepository);
container.bind<IAdminService>("IAdminService").to(AdminService);

export { container };