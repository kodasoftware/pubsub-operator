import * as k8s from '@kubernetes/client-node';

export function configureConfig(options) {
  const config = new k8s.KubeConfig();
  config.loadFromOptions(options);
  return config;
}

export function configureClient() {
  const config = new k8s.KubeConfig();
  config.loadFromDefault();
  return config.makeApiClient(k8s.CustomObjectsApi);
}
