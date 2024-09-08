export interface ITicket {
    _id: string;
    title: string;
    status: string;
    projects: {
        _id: string;
        name: string;
    };
    tasks: {
        _id: string;
        title: string;
    };
    description: string;
    created_at: string;
    developer: [
        {
            name: string;
        }
    ];
    tester: [
        {
            name: string;
        }
    ];
    upload_images:[]

}