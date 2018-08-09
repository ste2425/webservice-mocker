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
    routes: [/*{
        url: "/test",
        method: "GET",
        status: 200,
        body: () => {}, * Method or string *
        headers: {
            "Content-Type": "application/json"
        }
    }*/]
};
