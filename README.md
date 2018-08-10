# webservice-mocker
Simple configuration based web service mocking.

[<img src="https://api.travis-ci.com/ste2425/webservice-mocker.svg?branch=master">](https://travis-ci.com/ste2425/webservice-mocker)
[<img src="https://david-dm.org/ste2425/webservice-mocker.svg">](https://david-dm.org/ste2425/webservice-mocker)

# To use
Not yet on NPM.

## Clone repo
* In root of repo.
* Run `npm install`
* run `npm link`
* run `webservice-mocker -h` for commands.
* run `npm run test` for unit tests.

## To Do
* unit tests
* proper documentation
* Non CLI use (require and use within code)
* API integration - ability fire up server and provide configuration through API.

## Installation
Not currently published, see Clone Repo.

# API

`webservice-mocker [command] [arguments]`

### Help

`webservice-mocker [-h | --help]`

Displays the help menu providing a list of available commands

### Config

`webservice-mocker [-c | --config] [path to config.js]`

Run the webserver for the provided config file. Configuration can either be a JavaScript file or a JSON file. See Configuration for more information.

### Generate

`webservice-mocker [-g | --generate] > ./config.js`

Will return a default JavaScript config file on stdOut. This allows you to either pipe it to disk or to another program.

# Configuration

A JavaScript configuration file or JSON configuration file can be provided. The JavaScript option is more powerfull as it allows execution of logic for the request body response.

However the JSON option is simpler id static endpoint responses are required. So long as the schema's match they are interchangeable.

## Example

``` javascript
const someModule = require('C:/somepath.js'); // Files can be required.

module.exports = {
    port: 8080,
    noRoute: {
        method: "GET",
        status: 404,
        body: "No Content",
        headers: {
            "Content-Type": "text/plain"
        }
    },
    routes: [{
        url: "/test",
        method: "GET",
        status: 200,
        body: () => {
            return someModule.getSomeData();
        }, 
        headers: {
            "Content-Type": "application/json"
        }
    }]
};
```

## Requiring modules
In the above example a module has been imported and used to generate the response for the endpoint `/test`. 
This provides great flexability, however there are also limitations to this approach. Due to the internal mechanics of `require` it is not currently possible to require modules installed through `npm`.

If this is attempted the `require` call would expect that module to be provided my `webservice-mocker`'s package JSON and so would error. However absolute paths work perfectly well.

### configuration.port
Specifies the port the webserver will run on

### configuration.noRoute.status
Should a route handler not be found for a request, this status code will be returned.
### configuration.noRoute.body
Should a route handler not be found for a request, this request body will be returned. This can be a string or a method.
### configuration.noRoute.headers
Should a route handler not be found for a request, this is a key value pair of headers to be returned.

## configuration.routes
An array of routes which make up the endpoints that will be created. All options are the same as the no route options. The following options are extra

### configuration.routes[].url
The url to match against
### configuration.routes[].method
The HTTP verb that will be used allong side the URL to match a request.
