import Jwt from "jsonwebtoken";
import { IUsers } from "../entities/UserEntity";

export default interface IDecodedUser extends IUsers {
    decode: Jwt.JwtPayload

}