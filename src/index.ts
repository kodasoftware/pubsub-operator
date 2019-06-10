import { configuration, kubeConfig } from './config';
import { configureConfig, watch } from './k8s';
import {
  pubsub,
  createTopic,
  getTopics,
  getSubscriptions,
  createSubscription,
  modifySubscription,
  deleteSubscription
} from './pubsub';

const ADDED = 'ADDED';
const MODIFIED = 'MODIFIED';
const DELETED = 'DELETED';
const client = pubsub(configuration);
const config = configureConfig(kubeConfig);
const watchPubSubTopics = () => watch(
  config, 'pubsub.k8s.io', 'v1alpha1', 'pubsubtopics',
  handleTopicCustomResource,
  handleTopicEnd,
);
const watchPubSubSubscriptions = () => watch(
  config, 'pubsub.k8s.io', 'v1alpha1', 'pubsubsubscriptions',
  handleSubscriptionCustomResource,
  handleSubscriptionEnd,
);

async function handleTopicCustomResource(type, data) {
  const topicName = data.metadata.name;

  console.log(type, 'topic', topicName);

  if (type === ADDED || type === MODIFIED) {
    await createTopic(client, topicName);
  }
  if (type === DELETED) {
    console.log(type, 'has been removed, but controller does not implemented a delete from pub/sub');
  }
}

async function handleTopicEnd(err?: any) {
  if (err) console.log(err);
  console.log(await getTopics(client));
  return watchPubSubTopics();
}

async function handleSubscriptionCustomResource(type, data) {
  const topicName = data.spec.topic;
  const subscriptionName = data.metadata.name;
  const pushEndpoint = data.spec.endpoint;

  console.log(type, 'subscription', subscriptionName);
  
  if (type === ADDED) {
    await createTopic(client, topicName);
    await createSubscription(client, topicName, subscriptionName, pushEndpoint);
  }
  if (type === MODIFIED) {
    await modifySubscription(client, topicName, subscriptionName, pushEndpoint);
  }
  if (type === DELETED) {
    await deleteSubscription(client, subscriptionName);
  }
}

async function handleSubscriptionEnd(err?: any) {
  if (err) console.log(err);
  console.log(await getSubscriptions(client));
  return watchPubSubSubscriptions();
}

async function main() {
  await Promise.all([
    watchPubSubTopics(),
    watchPubSubSubscriptions(),
  ]);
}

main()
  .then(() => process.on('SIGINT', () => process.exit(0)))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
