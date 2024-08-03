import bcrypt from "bcryptjs";
const saltRounds = 10;

export default (password: string): string => {
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
}