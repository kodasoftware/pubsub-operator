import { App } from './app'
import { configuration, kubeConfig } from './config'

const GROUP = 'pubsub.k8s.io';
const VERSION = 'v1alpha1';
const [resource, group = GROUP, version = VERSION] = process.argv.slice(2)
const app = new App(group, version, resource, kubeConfig, configuration)

app.main()
