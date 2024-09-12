export interface ITask {
    _id: string;
    title: string;
    developer: { name: string }[];
    tester: { name: string }[];
    status: string;
    description: string;
    due_date: string;
    developer_id:string
    tester_id:string
}