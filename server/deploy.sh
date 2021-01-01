#!/bin/bash

echo What should the version be?
read VERSION

docker build -t nurdindev/hello_reddit:$VERSION .
docker push nurdindev/hello_reddit:$VERSION
ssh root@nurdindev "docker pull nurdindev/hello_reddit:$VERSION && docker tag nurdindev/hello_reddit:$VERSION dokku/reddit-api:$VERSION && dokku deploy reddit-api $VERSION"
