## NestJS kafka producer microservice

* NestJs
* kafka

## Requires a kafka cluster running in minikube

* kafka k8s projet: https://github.com/thoersch/kafka-kubernetes
* Optional, kafka-consumer microservice: https://github.com/thoersch/kafka-consumer-nest-microservice

## Kubernetes (minikube)

Prerequisities for minikube:
* `brew install hyperkit`
* `brew install minikube`

Start the minikube cluster
* `minikube start --vm-driver=hyperkit`

Verify cluster exists and ready:
* `kubectl get nodes`

Apply stack:

**NOTE** Apply zookeeper and kafka stack before applying coonsumer deployment

* `kubectl apply -f kafka-producer-deployment.yml`

Get IP for producer service:

* `minikube service kafka-producer-service`

```
$>
|-----------|------------------------|-------------|---------------------------|
| NAMESPACE |          NAME          | TARGET PORT |            URL            |
|-----------|------------------------|-------------|---------------------------|
| default   | kafka-producer-service |        8080 | http://192.168.64.2:30003 |
|-----------|------------------------|-------------|---------------------------|
🎉  Opening service default/kafka-producer-service in default browser...
```

If the consumeer project is running, you should get a reply from that microservice `ack`. Otherwise, you'll get a timeout but you can verify in the UI manager service of the kafka manager deployment.

## License

Copyright © 2021 Tyler Hoersch

Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.