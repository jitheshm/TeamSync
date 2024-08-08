import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ADMIN_SECRET_KEY as string;
const REFRESH_TOKEN_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET as string;

export function generateAdminAccessToken(data: object) {
    return jwt.sign(data, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function generateAdminRefreshToken(data: object) {
    return jwt.sign(data, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}


