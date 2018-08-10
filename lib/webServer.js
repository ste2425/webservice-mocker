const http = require('http');

class WebServer {
    constructor({port, routes, noRoute}) {
        this._routes = routes;
        this._connections = {};
        this._noRoute = noRoute;

        this._server = http.createServer((...args) => this._requestHandler(...args));
        this._server.listen(port);

        this._server.on('connection', (c) => this._connectionHandler(c));
    }

    destroy(cb) {
        this._server.close(cb);
        
        for(const key in this._connections) {
            this._connections[key].destroy();
        }
    }

    on(event, listener) {
        this._server.on(event, listener);
    }

    _requestHandler(request, response) {
        function respond(body, status, headers) {
            response.writeHead(status, headers);
            response.end(body);
        }
        
        const route = this._routes.getRoute(request.method, request.url);
        
        if (request.url === '/close') {
            respond('Closing Server.', 200);
            this.destroy();
        } else if (route) {
            respond(route.body, route.status, route.headers);
        } else {
            respond(this._noRoute.body, this._noRoute.status, this._noRoute.headers);
        }
    }

    _connectionHandler(connection) {
        const key = `${connection.remoteAddress}:${connection.remotePort}`;
        
        this._connections[key] = connection;
        connection.on('close', () => delete this._connections[key]);
    }
}

module.exports.WebServer = WebServer;

module.exports.create = function ({port, routes, noRoute}) {
    return new Promise((resolve, reject) => {
        const server = new WebServer({port, routes, noRoute});

        server.on('close', () => resolve());
    });
}
