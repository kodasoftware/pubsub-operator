import { App } from './app'
import { configuration, kubeConfig, configureConfig } from './config'

const GROUP = 'pubsub.k8s.io';
const VERSION = 'v1alpha1';
const [resource, group = GROUP, version = VERSION] = process.argv.slice(2)
const app = new App(group, version, resource, configureConfig(kubeConfig), configuration)

app.main()
