'use strict';

const ApiBuilder = require('claudia-api-builder');
const app = new ApiBuilder();

module.exports = app;

app.get('/test', function(request) {
    console.log('Event:', request);
    const name = request.queryString.name || 'World';
    return { greeting: 'Hello, ${name}!'};
});
