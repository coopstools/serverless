var ApiBuilder = require('claudia-api-builder'),
	AWS = require('aws-sdk'),
	api = new ApiBuilder(),
	dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "notes";

module.exports = api;

// Create new user
api.post('/note', function (request) {
	'use strict';
  var body = JSON.parse(request.body);
	var params = {
		TableName: TABLE_NAME,
		Item: {
			userId: body.userId,
      noteId: body.noteId,
			message: body.message
		}
	};
	// return dynamo result directly
	return dynamoDb.put(params).promise();
}, { success: 201 }); // Return HTTP status 201 - Created when successful

// get user for {id}
api.get('/note/{user_id}', function (request) {
	'use strict';
	var pathParams = JSON.parse(request.pathParams);
	// Get the id from the pathParams
	var params = {
		TableName: TABLE_NAME,
		Key: {
			userId: pathParams.user_id
		}
	};

	// post-process dynamo result before returning
	return dynamoDb.get(params).promise().then(function (response) {
		return response.Item;
	});
});

// delete user with {id}
api.delete('/note/{user_id}/{note_id}', function (request) {
	'use strict';
	// Get the id from the pathParams
	id = request.pathParams.user_id;
  noteId = request.pathParams.note_id
  var pathParams = JSON.parse(request.pathParams);
	var params = {
		TableName: TABLE_NAME,
		Key: {
			userId: pathParams.user_id,
      noteId: pathParams.note_id;
		}
	};
	// return a completely different result when dynamo completes
	return dynamoDb.delete(params).promise()
		.then(function () {
			return 'Deleted user with id "' + user_id + '"';
		});
}, {success: { contentType: 'text/plain'}});
