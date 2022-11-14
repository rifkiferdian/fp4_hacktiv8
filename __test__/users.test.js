const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { User } = require("../models");

const userData = {
    username: 'pertama',
    full_name: "pertama",
    email: 'pertama@gmail.com',
    password: '123456',
    profile_image_url: 'https://www.google.com',
    age: 20,
    phone_number: 81234567890
}

const userDataUpdate = {
    username: 'pertama',
    full_name: "kedua",
    email: 'kedua@gmail.com',
    profile_image_url: 'https://jestjs.io/docs/expect',
    age: 21,
    phone_number: 81234567891
}
let token;
let user;

describe('POST /users/register', () => {
    it('should send response with 201 status code', (done) => {
        request(app)
            .post('/users/register')
            .send(userData)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toEqual(201);
                expect(typeof res.body.user).toEqual('object');
                expect(res.body.user).toHaveProperty('username');
                expect(res.body.user).toHaveProperty('email');
                expect(res.body.user.username).toEqual(userData.username);
                expect(res.body.user.email).toEqual(userData.email);
                done();
            })
    });

    it('should send bad response cause email already exist', (done) => {
        request(app)
            .post('/users/register')
            .send(userData)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toEqual(400);
                expect(typeof res.body).toEqual('object');
                expect(res.body).toHaveProperty('status');
                expect(res.body).toHaveProperty('errors');
                expect(res.body.status).toEqual('fail');
                expect(res.body.errors[0]).toEqual('email already exists');
                done();
            })
    });
});

describe('POST /users/login', () => {
    it('should send response with 200 status code', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: userData.email,
                password: userData.password
            })
            .end((err, res) => {
                if (err) done(err);
                token = res.body.token;
                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual('object');
                expect(res.body).toHaveProperty('token');
                expect(typeof res.body.token).toEqual('string');
                expect(res.body.token).toContain('eyJ');
                done();
            })
    })

    it('should send response with 400 status code, because password is invalid', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: userData.email,
                password: 'asdfasdf'
            })
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toEqual(400);
                expect(typeof res.body).toEqual('object');
                expect(res.body).toHaveProperty('status');
                expect(res.body).toHaveProperty('message');
                expect(res.body.status).toEqual('fail');
                expect(res.body.message).toContain('Password Is Incorrect');
                done();
            })
    })
});

describe('PUT /users/:userId', () => {
    beforeAll(() => {
        return User.findOne({
            where: {
                email: userData.email
            }
        }).then((res) => user = res);
    })
    it('should send response with 200 status code, when user successfully updated', (done) => {
        request(app)
            .put(`/users/${user.id}`)
            .set('token', token)
            .send(userDataUpdate)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toEqual(200);
                expect(typeof res.body.user).toEqual('object');
                expect(res.body.user).toHaveProperty('full_name');
                expect(res.body.user).toHaveProperty('email');
                expect(res.body.user).toHaveProperty('profile_image_url');
                expect(res.body.user).toHaveProperty('age');
                expect(res.body.user).toHaveProperty('phone_number');
                expect(res.body.user.full_name).toEqual(userDataUpdate.full_name);
                expect(res.body.user.email).toEqual(userDataUpdate.email);
                expect(res.body.user.profile_image_url).toEqual(userDataUpdate.profile_image_url);
                expect(res.body.user.age).toEqual(userDataUpdate.age);
                expect(res.body.user.phone_number).toEqual(userDataUpdate.phone_number.toString());
                done();
            })
    });

    it('should send response with 404 status code, when user not found', (done) => {
        request(app)
            .put(`/users/99999999`)
            .set('token', token)
            .send(userDataUpdate)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual('object');
                expect(res.body).toHaveProperty('status');
                expect(res.body).toHaveProperty('message');
                expect(res.body.status).toEqual('fail');
                expect(res.body.message).toEqual('User not found...!')
                done();
            })
    });

    it('should send response with 401 status code, when token given not valid', (done) => {
        request(app)
            .put(`/users/${user.id}`)
            .set('token', 'eeijaisdjisaijijeokerjieojoaksdokasodkosa')
            .send(userDataUpdate)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toEqual(401);
                expect(typeof res.body).toEqual('object');
                expect(res.body).toHaveProperty('status');
                expect(res.body).toHaveProperty('message');
                expect(res.body.status).toEqual('fail');
                expect(res.body.message).toEqual('Invalid token given')
                done();
            })
    });
});

describe('DELETE /users/:userId', () => {
    it('should send response with 200 status code, when user successfully deleted', (done) => {
        request(app)
            .delete(`/users/${user.id}`)
            .set('token', token)
            .send(userDataUpdate)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual('object');
                expect(res.body).toHaveProperty('message');
                expect(typeof res.body.message).toEqual('string');
                expect(res.body.message).toEqual('Your account has been successfully deleted');
                done();
            })
    });

    it('should send response with 404 status code, when user not found', (done) => {
        request(app)
            .delete(`/users/99999999`)
            .set('token', token)
            .send(userDataUpdate)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual('object');
                expect(res.body).toHaveProperty('status');
                expect(res.body).toHaveProperty('message');
                expect(res.body.status).toEqual('fail');
                expect(res.body.message).toEqual('User not found...!')
                done();
            })
    });

    it('should send response with 401 status code, when token given not valid', (done) => {
        request(app)
            .delete(`/users/${user.id}`)
            .set('token', 'eeijaisdjisaijijeokerjieojoaksdokasodkosa')
            .send(userDataUpdate)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).toEqual(401);
                expect(typeof res.body).toEqual('object');
                expect(res.body).toHaveProperty('status');
                expect(res.body).toHaveProperty('message');
                expect(res.body.status).toEqual('fail');
                expect(res.body.message).toEqual('Invalid token given')
                done();
            })
    });
});

afterAll((done) => {
    sequelize.queryInterface.bulkDelete('Users', {})
        .then(() => {
            return done();
        })
        .catch((err) => {
            done(err);
        })
})