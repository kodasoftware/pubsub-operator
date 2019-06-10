import { PubSub } from '@google-cloud/pubsub';

const ALREADY_EXISTS = 6;

export async function getTopics(pubsub: PubSub, topicName?: string) {
  const topics = (await pubsub.getTopics())[0];
  if (topicName) {
    return topics.find((_topic) => _topic.name.includes(topicName));
  }
  return topics;
}

export async function createTopic(pubsub: PubSub, topicName: string) {
  try {
    const [topic] = await pubsub.createTopic(topicName);
    return topic;
  } catch (err) {
    if (err.code === ALREADY_EXISTS) {
      return getTopics(pubsub, topicName);
    }
    throw err;
  }
}
