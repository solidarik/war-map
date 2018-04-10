const app = require('../app');
const request = require('request-promise').defaults({
    resolveWithFullResponse: true,
    simple: false
});

let server;

const User = require('../libs/user');

function getURL(path) {
    return `http://localhost:3000${path}`;
};

describe("User REST API", async function() {

    let existingUserData = {
        email: "john@test.ru",
        displayName: "John"
    };
    let newUserData = {
        email: "alice@test.ru",
        displayName: "Alice"
    };
    let existingUser;

    before(done => {
      server = app.listen(3000, done);
    });

    after(done => {
      server.close(done);
    });

    beforeEach(async function() {
        // load fixtures
        await User.remove({});
        existingUser = await User.create(existingUserData);
    });

    describe("POST /users", async function() {
        it("creates a user", async function() {
            let response = await request({
                method: 'post',
                uri: getURL('/users'),
                json: true,
                body: newUserData
            });
            response.body.displayName.should.eql(newUserData.displayName);
            response.body.email.should.eql(newUserData.email);
        });

        it("throws if email already exists", async function() {
            let response = await request({
                method: 'post',
                uri: getURL('/users'),
                json: true,
                body: existingUserData
            });
            response.statusCode.should.eql(400);
            response.body.errors.email.should.exist;
        });

        it("throws if email not valid", async function() {
            let response = await request({
                method: 'post',
                uri: getURL('/users'),
                json: true,
                body: {
                    email: "invalid"
                }
            });
            response.statusCode.should.eql(400);
        });

    });

    describe("GET /user/:userById", async function() {
        it("gets the user by id", async function() {
            let response = await request.get(getURL('/users/' + existingUser._id));
            JSON.parse(response.body).email.should.exist;
            response.statusCode.should.eql(200);
            response.headers['content-type'].should.match(/application\/json/);
        });

        it("returns 404 if user does not exist", async function() {
            let response = await request.get(getURL('/users/55b693486e02c26010ef0000'));
            response.statusCode.should.eql(404);
        });

        it("returns 404 if invalid id", async function() {
            let response = await request.get(getURL('/users/kkkkk'));
            response.statusCode.should.eql(404);
        });
    });

    describe("DELETE /user/:userById", async function() {
        it("removes user", async function() {
            let response = await request.del(getURL('/users/' + existingUser._id));
            response.statusCode.should.eql(200);
            let users = await User.find({}).exec();
            users.length.should.eql(0);
        });

        it("returns 404 if the user does not exist", async function() {
            let response = await request.del(getURL('/users/55b693486e02c26010ef0000'));
            response.statusCode.should.eql(404);
        });
    });

    it("GET /users gets all users", async function() {
        let response = await request.get(getURL('/users'));
        response.statusCode.should.eql(200);
        response.headers['content-type'].should.match(/application\/json/);
        JSON.parse(response.body).length.should.eql(1);
    });
});
