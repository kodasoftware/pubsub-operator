import * as config from 'config';
import * as k8s from '@kubernetes/client-node';

const PROJECT_ID_KEY = 'google.projectId';
const API_ENDPOINT_KEY = 'google.pubsub.apiEndpoint';

let configuration = {
  projectId: config.get<string>(PROJECT_ID_KEY),
};

if (config.has(API_ENDPOINT_KEY)) {
  configuration = Object.assign(
    configuration,
    { apiEndpoint: config.get<string>(API_ENDPOINT_KEY) },
  );
}

const kubeConfig = config.has('kube.config') ? config.util.toObject(config.get('kube.config')) : null;
const cfg = config.util.toObject()

export function configureConfig(options?: any, inCluster: boolean = false) {
  const config = new k8s.KubeConfig();
  if (options) {
    config.loadFromOptions(options);
  } else if (inCluster) {
    config.loadFromCluster();
  } else {
    config.loadFromDefault()
  }
  return config;
}

export function configureClient() {
  const config = new k8s.KubeConfig();
  config.loadFromDefault();
  return config.makeApiClient(k8s.CustomObjectsApi);
}

export {
  cfg,
  configuration,
  kubeConfig,
}
