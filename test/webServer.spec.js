const expect = require('chai').expect,
    http = require('http'),
    sinon = require('sinon'),
    sandbox = sinon.createSandbox(),
    serverMock = {
        listen() {},
        on() {},
        close() {},
    };

describe('WebServer', () => {
    let webServerToTest;

    beforeEach(() => {
        webServerToTest = require('../lib/webServer').WebServer;
        sandbox.stub(http, 'createServer')
            .returns(serverMock);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('constructor', () => {
        it('creates instance', () => {
            const toTest = new webServerToTest({port: 10});

            expect(toTest).to.exist;
        });

        it('Sets server port', () => {
            sandbox.stub(serverMock, 'listen');

            new webServerToTest({port: 10});

            sinon.assert.calledWith(serverMock.listen, 10);
        });

        it('listens to server connections', () => {
            sandbox.stub(serverMock, 'on');

            new webServerToTest({});

            sinon.assert.calledOnce(serverMock.on);
            sinon.assert.calledWith(serverMock.on, 'connection');
        });
    });

    describe('destroy', () => {
        it('calls server destroy', () => {
            sandbox.stub(serverMock, 'close');

            const instance = new webServerToTest({});

            const cb = function () {};

            instance.destroy(cb);

            sinon.assert.calledOnce(serverMock.close);
            sinon.assert.calledWith(serverMock.close, cb);
        });

        it('closes open connections', () => {
            const connections = {
                one: {
                    destroy: sinon.spy()
                },
                two: {
                    destroy: sinon.spy()
                }
            };

            const instance = new webServerToTest({});

            instance._connections = connections;

            instance.destroy();

            sinon.assert.calledOnce(connections.one.destroy);
            sinon.assert.calledOnce(connections.two.destroy);
        });
    });

    describe('on', () => {
        it('proxies server on', () => {
            const instance = new webServerToTest({});

            sandbox.stub(serverMock, 'on');

            function cb() {}

            instance.on('eventName', cb);

            sinon.assert.calledOnce(serverMock.on);
            sinon.assert.calledWith(serverMock.on, 'eventName', cb);
        });
    });

    describe('_connectionHandler', () => {
        it('generates unique key per connection', () => {
            const conn = {
                remoteAddress: 'RA',
                remotePort: 'RP',
                on() {}
            };

            const instance = new webServerToTest({});

            instance._connectionHandler(conn);

            expect(instance._connections).to.have.keys('RA:RP');
        });

        it('Add connection to connections map', () => {
            const conn = {
                remoteAddress: 'RA',
                remotePort: 'RP',
                on() {}
            };

            const instance = new webServerToTest({});

            instance._connectionHandler(conn);

            expect(instance._connections).to.have.keys('RA:RP');
            expect(instance._connections['RA:RP']).to.eq(conn);
        });

        it('registers close handle to connection', () => {
            const conn = {
                remoteAddress: 'RA',
                remotePort: 'RP',
                on: sandbox.spy()
            };

            const instance = new webServerToTest({});

            instance._connectionHandler(conn);

            sinon.assert.calledOnce(conn.on);
            sinon.assert.calledWith(conn.on, 'close');
        });

        it('when close handle executed removes connection from connections map', () => {
            const conn = {
                remoteAddress: 'RA',
                remotePort: 'RP',
                on: sandbox.spy()
            };

            const instance = new webServerToTest({});

            instance._connectionHandler(conn);
            
            expect(instance._connections).to.have.keys('RA:RP');

            conn.on.getCall(0).args[1]();

            expect(instance._connections).to.not.have.keys('RA:RP');
        });;
    });

    describe('_requestHandler', () => {
        it('calls server destroy if close url requested', () => {
            const request = {
                url: '/close',
                method: 'GET'
            };
            const response = {
                writeHead: sandbox.spy(),
                end: sandbox.spy()
            };

            const instance = new webServerToTest({ routes: {
                getRoute() {}
            }});
            
            sandbox.spy(instance, 'destroy');

            instance._requestHandler(request, response);

            sinon.assert.calledOnce(instance.destroy);
            sinon.assert.calledOnce(response.end);
        });

        it('returns no route config if route not found', () => {            
            const request = {
                url: '/notfound',
                method: 'GET'
            };
            const response = {
                writeHead: sandbox.spy(),
                end: sandbox.spy()
            };

            const instance = new webServerToTest({ routes: {
                getRoute() {}
            }});

            instance._noRoute = {
                body: 'No Data',
                status: 404,
                headers: {
                    someheader: 'someval'
                }
            };

            instance._requestHandler(request, response);

            sinon.assert.calledWith(response.writeHead, 404, {
                someheader: 'someval'
            });
            sinon.assert.calledWith(response.end, 'No Data');
        });

        it('returns route config if route found', () => {            
            const request = {
                url: '/notfound',
                method: 'GET'
            };
            const response = {
                writeHead: sandbox.spy(),
                end: sandbox.spy()
            };

            const route = {
                url: '/myurl',
                method: 'get',
                body: 'Route found',
                status: 200,
                headers: {
                    header: 'val'
                }
            };

            const instance = new webServerToTest({ routes: {
                getRoute() {
                    return route;
                }
            }});

            instance._requestHandler(request, response);

            sinon.assert.calledWith(response.writeHead, 200, {
                header: 'val'
            });
            sinon.assert.calledWith(response.end, 'Route found');
        });
    });
});