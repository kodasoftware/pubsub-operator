import { configureConfig, watch } from './k8s';
import { configuration, kubeConfig } from './config';
import {
  handleTopicCustomResource,
  handleSubscriptionCustomResource,
  handleResourceEnd,
} from './controller';
import {
  pubsub,
  createTopic,
  getTopics,
  getSubscriptions,
  createSubscription,
  modifySubscription,
  deleteSubscription
} from './pubsub';

const GROUP = 'pubsub.k8s.io';
const VERSION = 'v1alpha1';
const RESOURCES = {
  TOPICS: 'pubsubtopics',
  SUBSCRIPTIONS: 'pubsubsubscriptions',
};
const client = pubsub(configuration);
const logger = console;

const watchPubSubTopics = (config) => watch(
  config, GROUP, VERSION, RESOURCES.TOPICS,
  handleTopicCustomResource(client, createTopic, logger),
  handleResourceEnd(client, getTopics, () => watchPubSubTopics(config), logger),
);
const watchPubSubSubscriptions = (config) => watch(
  config, GROUP, VERSION, RESOURCES.SUBSCRIPTIONS,
  handleSubscriptionCustomResource(
    client,
    createTopic,
    createSubscription,
    modifySubscription,
    deleteSubscription,
    logger,
  ),
  handleResourceEnd(client, getSubscriptions, () => watchPubSubSubscriptions(config), logger),
);

async function main() {
  const config = configureConfig(kubeConfig);
  await Promise.all([
    watchPubSubTopics(config),
    watchPubSubSubscriptions(config),
  ]);
}

main()
  .then(() => process.on('SIGINT', () => process.exit(0)))
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
