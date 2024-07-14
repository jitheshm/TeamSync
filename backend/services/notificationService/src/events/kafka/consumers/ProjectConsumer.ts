import mongoose from "mongoose";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import IConsumer from "../../../interfaces/IConsumer";
import TenantUserRepository from "../../../repository/implementations/TenantUserRepository";
import { ITenantUserRepository } from "../../../repository/interfaces/ITenantUserRepository";
import { sendMail } from "../../../utils/projectMailService";




let kafkaConnection = new KafkaConnection()
let tenantUserRepository: ITenantUserRepository = new TenantUserRepository()
export default class ProjectConsumer implements IConsumer {

    async consume() {
        try {

            let consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_project_group`)
            await consumer.subscribe({ topic: 'project-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("iam new project consumer");


                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new project consumer>>>>>>>>>>>>>>>");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(dataObj)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            switch (dataObj.eventType) {
                                case 'create': {

                                    const developers = dataObj.data.developers_id.map((id: any) => new mongoose.Types.ObjectId(id))
                                    const testers = dataObj.data.testers_id.map((id: any) => new mongoose.Types.ObjectId(id))
                                    const manager = new mongoose.Types.ObjectId(dataObj.data.project_manager_id)
                                    const members = [...developers, ...testers, manager]

                                    const users = await tenantUserRepository.fetchTenantUsersByIds(dataObj.dbName, members)
                                    console.log(users);
                                    const emails = users.map((user: any) => user.email)
                                    sendMail(emails, dataObj.data.name,dataObj.data.description)
                                    console.log("mail sent successfully");
                                    
                                    break;

                                }


                                // case 'update':

                                //     await projectRepository.update(dataObj.data, dataObj.dbName, dataObj.data._id)
                                //     break;


                            }
                        }

                    }
                },
            })
            console.log("subscribed to new project topic");

        } catch (error) {
            console.log(error);

        }
    }

}