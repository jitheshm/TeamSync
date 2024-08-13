export interface IAdminService {
    login(user_name: string, password: string): Promise<{ accessToken: string, refreshToken: string }>;
    newToken(refreshToken: string):string
}