#!/bin/bash

ssh root@catcat.io "cd ~/catcat-cloud && docker-compose down && docker-compose up --build -d"
