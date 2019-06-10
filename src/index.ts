import { pubsub } from './pubsub';
import { createTopic } from './topic';

const client = pubsub({ apiEndpoint: 'localhost:8085', projectId: 'my-project' });

async function main() {
  console.log(await client.getTopics());
  const topic = await createTopic(client, 'chris-topic');
  const topic2 = await createTopic(client, 'chris-topic2');
  console.log('topic', topic.name);
  console.log('topic2', topic2.name);
}

main().then(() => process.exit(0));
