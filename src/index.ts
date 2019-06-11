import { pubsub } from './pubsub';
import { configureConfig, watch } from './k8s';
import { configuration, kubeConfig } from './config';
import {
  handleTopicCustomResource,
  handleTopicEnd,
  handleSubscriptionCustomResource,
  handleSubscriptionEnd,
} from './controller';

const GROUP = 'pubsub.k8s.io';
const VERSION = 'v1alpha1';
const RESOURCES = {
  TOPICS: 'pubsubtopics',
  SUBSCRIPTIONS: 'pubsubsubscriptions',
};

const client = pubsub(configuration);
const watchPubSubTopics = (config) => watch(
  config, GROUP, VERSION, RESOURCES.TOPICS,
  handleTopicCustomResource(client),
  handleTopicEnd(client, watchPubSubTopics),
);
const watchPubSubSubscriptions = (config) => watch(
  config, GROUP, VERSION, RESOURCES.SUBSCRIPTIONS,
  handleSubscriptionCustomResource(client),
  handleSubscriptionEnd(client, watchPubSubSubscriptions),
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
    console.error(err);
    process.exit(1);
  });
