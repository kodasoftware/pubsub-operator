import Watcher from './watcher'
import { kubeConfig } from './config'
import { handleTopicCustomResource, handleSubscriptionCustomResource } from './controller';

const GROUP = 'pubsub.k8s.io';
const VERSION = 'v1alpha1';
const RESOURCES = {
  TOPICS: 'pubsubtopics',
  SUBSCRIPTIONS: 'pubsubsubscriptions',
};

async function main() {
  const [resource, group, version] = process.argv.slice(2)
  const watcher = new Watcher(kubeConfig)

  if (!resource) {
    throw Error('You must provide a RESOURCE as a parameter to watch a resource')
  }

  let handler
  switch (resource) {
    case RESOURCES.TOPICS:
      console.log('Handling', RESOURCES.TOPICS, 'resources')
      handler = handleTopicCustomResource
      break
    case RESOURCES.SUBSCRIPTIONS:
      console.log('Handling', RESOURCES.SUBSCRIPTIONS, 'resources')
      handler = handleSubscriptionCustomResource
      break
    default:
      handler = (phase: string, data: string) => {
        console.log('Fallback handler for unknown resource "' + resource + '".')
        console.log('Phase', phase)
        console.log('Data', data)
      }
  }
  
  console.log('Watching', (group || GROUP) + '/' + (version || VERSION) + '/' + resource)
  await watcher.watch(group || GROUP, version || VERSION, resource, handler)
  console.log('Finished watching', (group || GROUP) + '/' + (version || VERSION) + '/' + resource)
}

process.on('SIGINT', () => process.exit(0))
main().catch(err => {
  if (err) {
    console.error(err)
  }
  process.exit(1)
})