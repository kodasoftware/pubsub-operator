import { PubSub } from '@google-cloud/pubsub';

const ALREADY_EXISTS = 6;

export function getSubscriptions(pubsub: PubSub) {
  return pubsub.getSubscriptions();
}

export function getSubscription(pubsub: PubSub, subscriptionName: string) {
  return pubsub.subscription(subscriptionName).getMetadata();
}

export async function createSubscription(
  pubsub: PubSub,
  topicName: string,
  subscriptionName: string,
  pushEndpoint: string,
) {
  try {
    const config = { pushConfig: { pushEndpoint } };
    await pubsub.topic(topicName).createSubscription(subscriptionName, config);
  } catch (err) {
    if (err.code !== ALREADY_EXISTS) {
      throw err;
    }
  }
  return getSubscription(pubsub, subscriptionName);
}

export function modifySubscription(
  pubsub: PubSub,
  topicName: string,
  subscriptionName: string,
  pushEndpoint: string,
) {
  return pubsub.topic(topicName).subscription(subscriptionName).modifyPushConfig({ pushEndpoint });
}

export function deleteSubscription(
  pubsub: PubSub,
  subscriptionName: string,
) {
  return pubsub.subscription(subscriptionName).delete();
}
