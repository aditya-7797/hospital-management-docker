import { Kafka } from 'kafkajs';

let kafkaProducer;

export const connectKafka = async () => {
  const kafka = new Kafka({
    clientId: 'healthcare-backend',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
  });

  kafkaProducer = kafka.producer();

  await kafkaProducer.connect();
  console.log('📡 Kafka Producer connected');
};

export const publishEvent = async (topic, message) => {
  if (!kafkaProducer) {
    console.error('Kafka producer not initialized');
    return;
  }

  await kafkaProducer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }]
  });

  console.log(`📬 Event published to topic "${topic}"`);
};
