#!/usr/bin/env bash

echo 'after start docker container, run command "npm start"'

sudo docker-compose run --rm --service-ports home-media-server /bin/bash
