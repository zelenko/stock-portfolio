/*
Copyright 2019 Bill Zelenko. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://opensource.org/licenses/MIT
*/

'use strict';

const Hapi = require('hapi');
const AppDAO = require('./dao')
const Symbols = require('./symbols')
const Portfolio = require('./portfolio')

const dao = new AppDAO('./database.sqlite3')
const symboList = new Symbols(dao)
const pf = new Portfolio(dao)
const server = Hapi.server({
    port: 8080,
    host: 'localhost',
});

server.route({
    method: "GET",
    path: "/symbol/{id}",
    config: {cors: {origin: ['*']}},
    handler: async (request) => {
        var output
        try {
            output = await symboList.getById(encodeURIComponent(request.params.id))
        } catch (err) { console.log(err) }
        return output
    }
});

server.route({
    method: "GET",
    path: "/symbol/",
    config: {cors: {origin: ['*']}},
    handler: async () => {
        var output
        try {
            //output = await symboList.getAll()
            output = await symboList.getAllwithPrice()
        } catch (err) { console.log("error is:", err) }
        return output
    }
});

server.route({
    method: 'POST',
    path: "/symbol/",
    config: {cors: {origin: ['*']}},
    handler: async (request, response) => {
        var { name, open, high, low, close } = request.payload
        if ( !name || !open || name == "" || open == "" || high == "" || low=="" || close == ""){
            return response.response(`fields cannot be blank`)
        }
        name = encodeURIComponent(name)
        open = encodeURIComponent(open)
        high = encodeURIComponent(high)
        low = encodeURIComponent(low)
        close = encodeURIComponent(close)
        try {
            var output = await symboList.create(name, open, high, low, close)
        } catch (err) { console.log("error is:", err) }
        return output
    }
});

server.route({
    method: 'PUT',
    path: "/symbol/",
    config: {cors: {origin: ['*']}},
    handler: async (request, response) => {
        var { id, name, open, high, low, close } = request.payload
        if (!id || !name || !open || name == "" || open == "" || high == "" || low=="" || close == ""){
            return response.response(`fields cannot be blank`)
        }
        var newSymbol = {};
        newSymbol.id = encodeURIComponent(id)
        newSymbol.name = encodeURIComponent(name)
        newSymbol.open = encodeURIComponent(open)
        newSymbol.high = encodeURIComponent(high)
        newSymbol.low = encodeURIComponent(low)
        newSymbol.close = encodeURIComponent(close)
        try {
            var output = await symboList.update(newSymbol)
        } catch (err) { console.log("error is:", err) }
        return output
    }
});

server.route({
    method: 'DELETE',
    path: "/symbol/{id}",
    config: {cors: {origin: ['*']}},
    handler: async (request, response) => {
        var id = encodeURIComponent(request.params.id)
        if (!id || id == ""){
            return response.response(`need valid ID`)
        }
        try {
            var output = await symboList.delete(id)
        } catch (err) { console.log("error is:", err) }
        return output
    }
});

// PORTFOLIOS ============================
server.route({
    method: "GET",
    path: "/portfolio/",
    config: {
        cors: {
            origin: ['*']
            //additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    handler: async () => {
        var output
        try {
            //output = await pf.createTable()
            //output = await pf.getAll()
            output = await pf.getAllwithClosePrice()
        } catch (err) { console.log("error is:", err) }
        return output
    }
});

server.route({
    method: "GET",
    path: "/portfolio/{id}",
    config: {cors: {origin: ['*']}},
    handler: async (request) => {
        var output
        try {
            output = await pf.getById(encodeURIComponent(request.params.id))
        } catch (err) { console.log(err) }
        return output
    }
});

server.route({
    method: 'POST',
    path: "/portfolio/",
    config: {cors: {origin: ['*']}},
    handler: async (request, response) => {
        var { name, qty, price } = request.payload
        if ( !name || !qty || qty == "" || price == ""){
            return response.response(`fields cannot be blank`)
        }
        name = encodeURIComponent(name)
        qty = encodeURIComponent(qty)
        price = encodeURIComponent(price)
        try {
            var output = await pf.create(name, qty, price)
        } catch (err) { console.log("error is:", err) }
        return output
    }
});

server.route({
    method: 'PUT',
    path: "/portfolio/",
    config: {cors: {origin: ['*']}},
    handler: async (request, response) => {
        var { id, name, qty, price } = request.payload
        if (!id || !name || !qty || qty == "" || price == ""){
            return response.response(`fields cannot be blank`)
        }
        var updatePI = {};
        updatePI.id = encodeURIComponent(id)
        updatePI.name = encodeURIComponent(name)
        updatePI.qty = encodeURIComponent(qty)
        updatePI.price = encodeURIComponent(price)
        try {
            var output = await pf.update(updatePI)
        } catch (err) { console.log("error is:", err) }
        return output
    }
});

server.route({
    method: 'DELETE',
    path: "/portfolio/{id}",
    config: {cors: {origin: ['*']}},
    handler: async (request, response) => {
        var id = encodeURIComponent(request.params.id)
        if (!id || id == ""){
            return response.response(`need valid ID`)
        }
        try {
            var output = await pf.delete(id)
        } catch (err) { console.log("error is:", err) }
        return output
    }
});

const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();