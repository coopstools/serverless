var ApiBuilder = require('claudia-api-builder');
var AWS = require('aws-sdk');
var api = new ApiBuilder();
var dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = api;

api.post('/user', function (request) {
    'use strict';
    console.log(request);
    var params = { 
        TableName: request.env.tableName,
        Item: {
            userid: request.body.userId,
            name: request.body.name,
            age: request.body.age
        }
    };

    return dynamoDb.put(params).promise();
}, { success: 201 });

api.get('/user/{id}', function (request) {
    'use strict';
    var id, params;
    id = request.pathParams.id;
    params =  {
        TableName: request.env.tableName,
        Key: {
            userid: id
        }
    };

    return dynamoDb.get(params).promise().then(function (response) {
        return response.Item;
    });
});

api.addPostDeployConfig('tableName', 'DynamoDB Table Name:', 'configure-db');
