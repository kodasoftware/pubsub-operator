import * as cfg from 'config';
import * as k8s from '@kubernetes/client-node';

export const config = cfg.util.toObject()
export const pubsubConfig = config.google || {}
export const kubeConfig = config.kube.config || {}

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
