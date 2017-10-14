#!bin/bash

aws s3 sync . s3://coopstools.public/ --profile coopstools --region us-east-1 --acl public-read --exclude sync.sh
