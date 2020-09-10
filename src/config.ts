import * as config from 'config';

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

export {
  cfg,
  configuration,
  kubeConfig,
}
