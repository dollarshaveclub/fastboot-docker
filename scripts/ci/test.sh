#!/bin/sh

docker build -t dollarshaveclub/fastboot . && \
docker build -t test-container test/fixtures/fastboot-app/. && \

#Test with polling OFF
docker run --name fastboot-app -d -e "WORKER_COUNT=1" -p 127.0.0.1:3000:3000 test-container && \
sleep 2 && \
docker ps -a && \

cd test/ && npm test && cd .. && \
docker stop fastboot-app && \
docker rm fastboot-app && \

#Test with polling ON && \
docker run --name fastboot-app -d -e "POLLING=true" -e "WORKER_COUNT=1" -p 127.0.0.1:3000:3000 test-container && \
sleep 2 && \
docker ps -a && \
cd test/ && npm test && cd ..
