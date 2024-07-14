

export interface IAdminService {
    authenticateAdmin(username: string, password: string): Promise<string | null>;
}
