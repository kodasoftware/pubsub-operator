import { configureConfig, watch as _watch } from './k8s';
import { KubeConfig } from '@kubernetes/client-node';

class Watcher {
  private readonly kubeConfig: KubeConfig

  constructor(kubeConfig?: any) {
    this.kubeConfig = configureConfig(kubeConfig)
  }

  public watch(group: string, version: string, resource: string, handler: (phase: string, object: any) => void) {
    return _watch(this.kubeConfig, group, version, resource, handler, this.handleError)
  }

  private handleError(err?: any) {
    if (err) {
      console.error(err)
    }
  }
}

export default Watcher