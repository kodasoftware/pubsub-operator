import { App } from './app'
import { configuration, kubeConfig, configureConfig } from './config'

const GROUP = 'pubsub.k8s.io';
const VERSION = 'v1alpha1';
const [resource, group = GROUP, version = VERSION] = process.argv.slice(2)
const config = configureConfig(kubeConfig, Boolean(process.env.IN_CLUSTER) || false)
console.log('Starting server with config', JSON.stringify(config))
const app = new App(group, version, resource, config, configuration, process.env.NAMESPACE || 'default')

app.main()
