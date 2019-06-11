import { pubsub } from './pubsub';
import { configureConfig, watch } from './k8s';
import { configuration, kubeConfig } from './config';
import {
  handleTopicCustomResource,
  handleTopicEnd,
  handleSubscriptionCustomResource,
  handleSubscriptionEnd,
} from './controller';

const client = pubsub(configuration);
const watchPubSubTopics = (config) => watch(
  config, 'pubsub.k8s.io', 'v1alpha1', 'pubsubtopics',
  handleTopicCustomResource(client),
  handleTopicEnd(client, watchPubSubTopics),
);
const watchPubSubSubscriptions = (config) => watch(
  config, 'pubsub.k8s.io', 'v1alpha1', 'pubsubsubscriptions',
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
