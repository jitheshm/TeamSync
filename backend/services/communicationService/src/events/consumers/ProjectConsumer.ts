import { KafkaConnection } from "../../config/kafka/KafkaConnection";
import IConsumer from "../../interfaces/IConsumer";
import ProjectRepository from "../../repository/implementations/ProjectRepository";



let kafkaConnection = new KafkaConnection()

export default class ProjectConsumer implements IConsumer {

    async consume() {
        try {

            let consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_tenant_project_group`)
            await consumer.subscribe({ topic: 'project-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("iam new project consumer");
                    let projectRepository = new ProjectRepository()
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new project consumer>>>>>>>>>>>>>>>");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            switch (dataObj.eventType) {
                                case 'create':

                                    await projectRepository.create(dataObj.data, dataObj.dbName)
                                    break;
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