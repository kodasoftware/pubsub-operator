import { App } from './app'
import { pubsubConfig, kubeConfig, configureConfig } from './config'

const GROUP = 'pubsub.k8s.io';
const VERSION = 'v1alpha1';
const [resource, group = GROUP, version = VERSION] = process.argv.slice(2)
const config = configureConfig(kubeConfig, Boolean(process.env.IN_CLUSTER) || false)
console.log('Starting server with kube config', JSON.stringify(config))
console.log('Started server with pubsub config', JSON.stringify(pubsubConfig))
const app = new App(group, version, resource, config, pubsubConfig, process.env.NAMESPACE || 'default')

app.main()
