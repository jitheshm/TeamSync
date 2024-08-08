import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET_KEY as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export function generateAccessToken(data: object) {
    console.log(ACCESS_TOKEN_SECRET,"access")
    console.log(REFRESH_TOKEN_SECRET,"refresh")
    return jwt.sign(data, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(data: object) {
    return jwt.sign(data, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}


