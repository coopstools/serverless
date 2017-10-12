#! bin/bash

aws dynamodb create-table --table-name dynamo-test \
    --profile coopstools \
    --attribute-definitions AttributeName=userid,AttributeType=S \
    --key-schema AttributeName=userid,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --query TableDescription.TableArn \
    --region us-east-1 \
    --profile coopstools \
    --output text
