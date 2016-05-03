const Hapi = require('hapi')
const Inert = require('inert');
const Path = require('path');

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname)
            }
        }
    }
});

const port = process.env.PORT || 3000  
//const server = new Hapi.Server()

server.connection({ port: port })

server.register(Inert, () => { });

server.route({
    method: 'GET',
    path: '/',
    handler: {
        file: __dirname + '/index.html'
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: __dirname
        }
    }
});

server.start((err) => {
    console.log('Server running at:', server.info.uri, err ? err : '');
})


var dbOpts = {
    "url": "mongodb://localhost:27017/testGradProj",
    "settings": {
        "db": {
            "native_parser": false
        }
    }
};

server.register({
    register: require('hapi-mongodb'),
    options: dbOpts
}, function (err) {
    if (err) {
        console.error(err);
        throw err;
    }
});


server.route({
    "method": "GET",
    "path": "/findProf",
    "handler": findAllProfessor
});

function findAllProfessor(request, reply) {
    var name = request.params.name;
    var db = request.server.plugins['hapi-mongodb'].db;
    var collection = db.collection('professors');
    collection.find().toArray(function (err, items) {
        reply(JSON.stringify(items));

    });
};

server.route({
    "method": "POST",
    "path": "/addProf",
    "handler": addProfessor
});

function addProfessor(request, reply) {
    var prof = request.payload.prof;
    prof[0].rating = 0;
    prof[0].ratedBy = [];
    var db = request.server.plugins['hapi-mongodb'].db;
    var collection = db.collection('professors');
    collection.insert(prof, { w: 1 }, function (err, result) {
    });
};

server.route({
    "method": "GET",
    "path": "/findUni",
    "handler": findUniversity
});

function findUniversity(request, reply) {
    var db = request.server.plugins['hapi-mongodb'].db;
    var collection = db.collection('universities');
    collection.find().toArray(function (err, items) {
        reply(JSON.stringify(items));

    });
};

server.route({
    "method": "POST",
    "path": "/addUni",
    "handler": addUniversity
});

function addUniversity(request, reply) {
    var uni = request.payload.uni;
    var db = request.server.plugins['hapi-mongodb'].db;
    var collection = db.collection('universities');
    collection.insert(uni, { w: 1 }, function (err, result) {
    });
};

server.route({
    "method": "POST",
    "path": "/signup",
    "handler": addNewUser
});

function addNewUser(request, reply) {
    var newUser = request.payload.newUser;
    var db = request.server.plugins['hapi-mongodb'].db;
    var collection = db.collection('users');
    collection.insert(newUser, { w: 1 }, function (err, result) {
        if (err) {
            reply("Failure");
        }
        else {
            reply("Success");
        }

    });

};

server.route({
    "method": "GET",
    "path": "/login/{id}",
    "handler": findUser
});

function findUser(request, reply) {
    var id = request.params.id;
    var db = request.server.plugins['hapi-mongodb'].db;
    var collection = db.collection('users');
    collection.find({ "_id": id }).toArray(function (err, items) {
        if (err) {
            reply("Failure");
        }
        else {
            reply(JSON.stringify(items));
        }

    });

};

server.route({
    "method": "GET",
    "path": "/getAllUsers",
    "handler": getAllUsers
});

function getAllUsers(request, reply) {
    var db = request.server.plugins['hapi-mongodb'].db;
    var collection = db.collection('users');
    collection.find().toArray(function (err, items) {
        reply(JSON.stringify(items));

    });
};

server.route({
    "method": "POST",
    "path": "/updateRating",
    "handler": updateRating
});

function updateRating(request, reply) {
    var prof = request.payload.prof;
    var rating = request.payload.rating;
    var user = request.payload.user;
    var ratedBy = { "user": user.name, "rate": user.rate }
    var db = request.server.plugins['hapi-mongodb'].db;
    var collection = db.collection('professors');
    collection.update(
        { name: prof.name },
        { $set: { rating: rating }, $push: { ratedBy: ratedBy } },
        function (err, object) {
            if (err) {
                console.warn(err.message);
            } else {
                reply(JSON.stringify(object));
            }
        });
};