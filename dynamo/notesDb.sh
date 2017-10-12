#! bin/bash

aws dynamodb create-table --table-name notes \
    --profile coopstools \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=noteId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
        AttributeName=noteId,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --query TableDescription.TableArn \
    --region us-east-1 \
    --profile coopstools \
    --output text
