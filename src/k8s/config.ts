import * as k8s from '@kubernetes/client-node';

export function configureConfig(options?: any) {
  const config = new k8s.KubeConfig();
  if (options) {
    config.loadFromOptions(options);
  } else {
    config.loadFromCluster();
  }
  return config;
}

export function configureClient() {
  const config = new k8s.KubeConfig();
  config.loadFromDefault();
  return config.makeApiClient(k8s.CustomObjectsApi);
}
