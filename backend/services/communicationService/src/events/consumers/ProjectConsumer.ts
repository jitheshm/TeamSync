import mongoose from "mongoose";
import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import IChats from "../../entities/ChatEntity";
import IConsumer from "../../interfaces/IConsumer";
import ChatRepository from "../../repository/implementations/ChatRepository";
import ProjectRepository from "../../repository/implementations/ProjectRepository";



let kafkaConnection = new KafkaConnection()
let projectRepository = new ProjectRepository()
let chatRepository = new ChatRepository()

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
                                    await projectRepository.create(dataObj.data, dataObj.dbName)
                                    // console.log(dataObj.data.testers_id.map((id: any) => new mongoose.Types.ObjectId(id)));
                                    
                                    const developers = dataObj.data.developers_id.map((id: any) => new mongoose.Types.ObjectId(id))
                                    const testers = dataObj.data.testers_id.map((id: any) => new mongoose.Types.ObjectId(id))
                                    const data = {
                                        name: dataObj.data.name,
                                        group_id: dataObj.data._id,
                                        chat_id: '#chat' + new Date().getTime() + Math.floor(Math.random() * 1000),
                                        type: 'group',
                                        members: [...developers, ...testers, new mongoose.Types.ObjectId(dataObj.data.project_manager_id)],

 
                                    }
                                    console.log(data);
                                    
                                    await chatRepository.create(dataObj.dbName, data as IChats)
                                    break;

                                }


                                case 'update':

                                    await projectRepository.update(dataObj.data, dataObj.dbName, dataObj.data._id)
                                    break;


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