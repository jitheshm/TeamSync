
import { IConsumer } from "teamsync-common";
import { KafkaConnection } from "../../../config/kafka/KafkaConnection";
import BranchRepository from "../../../repository/implementations/BranchRepository";


let kafkaConnection = new KafkaConnection()

export default class BranchConsumer implements IConsumer {

    async consume() {
        try {

            let consumer = await kafkaConnection.getConsumerInstance(`${process.env.SERVICE}_branches_group`)
            await consumer.subscribe({ topic: 'branch-events', fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("iam new branch consumer");
                    let branchRepository = new BranchRepository()
                    let data = message.value?.toString()
                    console.log(data);
                    console.log("iam new branch consumer>>>>>>>>>>>>>>>");

                    if (data) {
                        let dataObj = JSON.parse(data)
                        console.log(data)
                        const origin = message.headers?.origin?.toString();

                        if (origin != process.env.SERVICE) {
                            switch (dataObj.eventType) {
                                case 'create':

                                    await branchRepository.create(dataObj.data, dataObj.dbName)
                                    break;
                                case 'update':

                                    await branchRepository.update(dataObj.data, dataObj.dbName, dataObj.data._id)
                                    break;


                            }
                        }

                    }
                },
            })
            console.log("subscribed to new branch topic");

        } catch (error) {
            console.log(error);

        }
    }

}