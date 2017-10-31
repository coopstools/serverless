var ApiBuilder = require('claudia-api-builder'),
	AWS = require('aws-sdk'),
	api = new ApiBuilder(),
	dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "notes";

module.exports = api;

// Create new user
api.post('/note', function (request) {
	'use strict';

  var date = new Date();
  var timeStamp = (date.getYear() + 1900) + "/" +
    (date.getMonth() + 1) + "/" +
    date.getDate() + " " +
    date.getHours() + ":" +
    date.getMinutes() + ":" +
    date.getSeconds() + "." +
    date.getMilliseconds();

  var body = request.body;
	var params = {
		TableName: TABLE_NAME,
		Item: {
			userId: body.userId,
      noteId: timeStamp,
			message: body.message
		}
	};
	// return dynamo result directly
	return dynamoDb.put(params).promise();
}, { success: 201 }); // Return HTTP status 201 - Created when successful

// get user for {id}
api.get('/note/{user_id}', function (request) {
	'use strict';
	var pathParams = request.pathParams;
	// Get the id from the pathParams
	var params = {
		TableName: TABLE_NAME,
    KeyConditionExpression: "userId = :i",
    ExpressionAttributeValues: {
      ":i": pathParams.user_id
		}
	};

	// post-process dynamo result before returning
	return dynamoDb.query(params).promise().then(function (response) {
		return response.Items;
	});
});

// delete user with {id}
api.delete('/note/{user_id}', function (request) {
	'use strict';
  var user_id = request.pathParams.user_id;
	var params = {
		TableName: TABLE_NAME,
		Key: {
			userId: user_id,
      noteId: request.queryString.noteId
		}
	};
	// return a completely different result when dynamo completes
	return dynamoDb.delete(params).promise()
		.then(function () {
			return 'Deleted message from user "' + user_id + '"';
		});
}, {success: { contentType: 'text/plain'}});
