#!/bin/bash

ssh root@catcat.io "mkdir -p \
~/catcat-cloud/ipfs_data \
~/catcat-cloud/ipfs_staging \
~/catcat-cloud/pg_data \
~/catcat-cloud/pgadmin_data"

rsync -Praz --delete --exclude=node_modules --exclude=ipfs_data --exclude=ipfs_staging --exclude=pg_data --exclude=pgadmin_data --exclude=ts-node* --exclude=.git --exclude=lib ../ root@catcat.io:~/catcat-cloud