import { Kafka, Producer } from "kafkajs";
import { Messages } from "../types";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

let producer: null | Producer = null;
const consumer = kafka.consumer({ groupId: "test-group" });

export async function getProducer() {
  if (producer) return producer;
  producer = kafka.producer();
  await producer.connect();
  return producer;
}

export async function produceMessages(message: Messages) {
  const producer = await getProducer();
  producer.send({
    topic: "MESSAGES",
    messages: [{ key: `key-${Date.now()}`, value: JSON.stringify(message) }],
  });
}

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });
  console.log("KAFKA LOGS");

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log("Received:", message.value?.toString());
    },
  });
}

run();
