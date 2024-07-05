export interface ITenantUsers {
    _id: string;
    email: String;
    created_at: string;
    name: String;
    tenant_user_id: String;
    role: String;
    is_deleted: Boolean;
    branch_id: string;
    phone_no: String;
    
}


export interface IProjects {
    _id: string;
    name: String;
    project_id: String;
    description: String;
    developers_id: string[];
    stage: String;
    project_manager_id: string;
    manager:ITenantUsers[]
    developer:ITenantUsers[]
    tester:ITenantUsers[]
    project_manager:ITenantUsers[]
    end_date: string;
    start_date: string;
    created_at: string;
    branch_id: string;
    client_name: String;
    tester_id: string;
    is_deleted: Boolean;
}