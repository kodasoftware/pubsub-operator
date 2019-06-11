import * as cli from 'command-line-args';
import * as help from 'command-line-usage';

import { configuration } from './config';
import {
  pubsub,
  getTopics,
  createTopic,
  getSubscriptions,
  createSubscription,
  modifySubscription,
  deleteSubscription,
} from './pubsub';

const client = pubsub(configuration);
const commands = {
  getTopics,
  createTopic,
  getSubscriptions,
  createSubscription,
  modifySubscription,
  deleteSubscription,
};
const commandOptions = [
  'getTopics',
  'createTopic',
  'getSubscriptions',
  'createSubscription',
  'modifySubscription',
  'deleteSubscription',
];
const options = [
  { name: 'command', type: String, multiple: false, defaultOption: true },
  { name: 'topic', type: String, alias: 't' },
  { name: 'subscription', type: String, alias: 's' },
  { name: 'pushEndpoint', type: String, alias: 'p' },
];
const sections = [{
  header: 'Pub/Sub Controller',
  content: 'CLI to run the pub/sub controller commands',
}, {
  header: 'Usage',
  content: [
    '$ {italic <command>} [options]',
    '$ npm run cli {italic <command>} [--topic name --subscription name --pushEndpoint uri]',
  ]
}, {
  header: 'Commands',
  content: [
    '{bold getTopics} - Returns all topics',
    '{bold createTopic} - Creates a topic',
    '{bold getSubscriptions} - Return all subscriptions',
    '{bold createSubscription} - Creates a subscription',
    '{bold modifySubscription} - Modifies an existing subscription',
    '{bold deleteSubscription} - Deletes an existing subscription',
  ]
}, {
  header: 'Options',
  optionList: [{
    name: 'topic',
    alias: 't',
    type: String,
    description: 'The name of the topic',
  }, {
    name: 'subscription',
    alias: 's',
    type: String,
    description: 'The name of the subscription',
  }, {
    name: 'pushEndpoint',
    alias: 'p',
    type: String,
    description: 'The name of the endpoint to push messages to for a subscription',
  }],
}];

function showHelp() {
  console.log(help(sections));
}

const args = cli(options);

if (!args.command || !commandOptions.includes(args.command)) {
  showHelp();
  process.exit(0);
}

if (args.environment) {
  process.env.NODE_ENV = args.environment;
}

const executable = commands[args.command];

if (executable === getTopics) {
  executable(client, args.topic).then(console.log);
}

if (executable === createTopic) {
  if (!args.topic) {
    console.error('No topic set');
    process.exit(1);
  }
  executable(client, args.topic).then(console.log);
}

if (executable === getSubscriptions) {
  executable(client).then(console.log);
}

if (executable === createSubscription || executable === modifySubscription) {
  if (!args.topic || !args.subscription || !args.pushEndpoint) {
    console.error('Must set topic, subscription and pushEndpoint');
    process.exit(1);
  }
  executable(client, args.topic, args.subscription, args.pushEndpoint).then(console.log);
}

if (executable === deleteSubscription) {
  if (!args.subscription) {
    console.error('No subscription given');
    process.exit(1);
  }
  executable(client, args.subscription).then(console.log);
}
