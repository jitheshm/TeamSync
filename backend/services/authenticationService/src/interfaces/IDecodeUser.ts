import Jwt from "jsonwebtoken";
import { IUsers } from "../entities/UserEntity";

export default interface decodedUser extends IUsers {
    decode: Jwt.JwtPayload

}