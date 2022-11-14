const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

const userData = {
     username: 'pertama',
     full_name: "farhan",
     email: 'pertama@gmail.com',
     password: '123456',
     profile_image_url: 'https://www.google.com',
     age: 20,
     phone_number: 81234567890
}

describe('POST /users/register', () => {
     it('should send response with 201 status code', (done) => {
         request(app)
          .post('/users/register')
          .send(userData)
          .end((err, res) => {
              if(err) done(err);
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
             if(err) done(err);
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

afterAll((done) => {
    sequelize.queryInterface.bulkDelete('Users', {})
    .then(() => {
        return done();
    })
    .catch((err) => {
        done(err);
    })
})