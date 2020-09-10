import * as k8s from '@kubernetes/client-node';

export { configureClient, configureConfig } from './config';

export async function getCustomObject(
  client: k8s.CustomObjectsApi,
  group: string,
  version: string,
  resource: string,
  watch: boolean = false,
) {
  try {
    const response = await client.listClusterCustomObject(
      group, version, resource, 'true', undefined, undefined, undefined, undefined, watch,
    );
    return response;
  } catch (err) {
    console.error(err);
  }
}

export function watch(
  config: k8s.KubeConfig,
  group: string,
  version: string,
  resource: string,
  callback: (phase: string, obj: any) => void,
  done: (err: any) => void,
) {
  const watcher = new k8s.Watch(config);
  console.log(watcher.config)
  return watcher.watch(`/apis/${group}/${version}/${resource}`, {}, callback, done);
}