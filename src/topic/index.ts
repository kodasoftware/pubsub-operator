import { PubSub } from '@google-cloud/pubsub';

const ALREADY_EXISTS = 6;

export async function createTopic(pubsub: PubSub, topicName: string) {
  try {
    const [topic] = await pubsub.createTopic(topicName);
    return topic;
  } catch (err) {
    if (err.code === ALREADY_EXISTS) {
      const name = `projects/${pubsub.projectId}/topics/${topicName}`;
      return (await pubsub.getTopics())[0].find((_topic) => _topic.name === name);
    }
    throw err;
  }
}
