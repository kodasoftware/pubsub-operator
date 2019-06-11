# Pub/Sub Operator

A set of kubernetes operators to create GCloud Pub/Sub Topics and Subscribers.

# Quick start

This example assumes you are using Minikube locally to deploy the pub/sub operator to

```
# Start minikube
# minikube start

# Deploy service account for the operator
kubectl apply -f deploy/service_account.yaml
kubectl apply -f deploy/role.yaml
kubectl apply -f deploy/role_binding.yaml

# Deploy custom resource definitions for pubsubtopics and pubsubsubscribers
kubectl apply -f deploy/pubsubtopic.crd.yaml -f deploy/pubsubsubscriber

# You need to build and publish the operator controller image
export CONTROLLER_NAME=<controller name>
export VERSION=<version>
docker build -t $CONTROLLER_NAME:$VERSION .
docker push $CONTROLLER_NAME:$VERSION

# Update the operator.yaml (line 54 with the new controller image name)
# sed -i "" 's|REPLACE_IMAGE|$CONTROLLER_NAME:$VERSION|g' deploy/operator.yaml

# Create secrets necessary for the controller to connect to the cluster. This can be found in yourt
# $HOME/.minkube/ directory
cp $HOME/.minikube/ca.crt $HOME/.minikube/client.crt $HOME/.minikube/client.key examples/
kubectl create secret generic pub-sub-secret \
  --from-file=examples/ca.crt \
  --fromfile=examples/client.crt \
  --fromfile=examples/client.key

# Deploy controller for custom resource
kubectl apply -f deploy/operator.yaml

# Create a topic
kubectl apply -f examples/pubsubtopic.cr.yaml

# Create a subscriber
kubectl apply -f examples/pubsubsubscription.cr.yaml

# Verify custom resources
kubectl get pubsubtopics
kubectl get pubsubsubscriptions
```

# Running tests

```
npm install
npm run test
```

# Running CLI

```
NODE_ENV=<environment config> npm run cli <command> <args>
```

To get a help view of the command and options execute `npm run cli`.
