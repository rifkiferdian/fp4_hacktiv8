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

const userDataUnauthozrized = {
  username: 'kedua',
  full_name: "kedua",
  email: 'kedua@gmail.com',
  password: '123456',
  profile_image_url: 'https://www.google.com',
  age: 20,
  phone_number: 81234567890
}

const photoData = {
  poster_image_url: "https://www.google.com",
  title: "Foto Google",
  caption: "Ini adalah foto google"
}
  
let token;
let token2;
let photoId;

beforeAll(() => {
  return request(app).post('/users/register').send(userData).then(res => {
    return request(app).post('/users/login').send({
      email: userData.email,
      password: userData.password
    }).then(res => {
        token = res.body.token;
        return request(app).post('/photos').set('token', token).send(photoData).then(res => {
            photoId = res.body.id;
        })
    });
  });
})

beforeAll(() => {
  return request(app).post('/users/register').send(userDataUnauthozrized).then(res => {
    return request(app).post('/users/login').send({
      email: userDataUnauthozrized.email,
      password: userDataUnauthozrized.password
    }).then(res => token2 = res.body.token);
  });
})

describe('POST /comments', () => {
  it('should send response with 201 status code', done => {
    request(app)
      .post('/comments')
      .set('token', token)
      .send({
            PhotoId: photoId,
            comment: "photonya Bagus"
        })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('comment');
        expect(res.body.comment).toHaveProperty('id');
        expect(res.body.comment).toHaveProperty('comment');
        expect(res.body.comment).toHaveProperty('UserId');
        expect(res.body.comment).toHaveProperty('PhotoId');
        expect(res.body.comment.comment).toEqual("photonya Bagus");
        expect(res.body.comment.PhotoId).toEqual(photoId);
        done();
      });
  });

  it('should send response with 422 status code, because comment not empty', done => {
    request(app)
      .post('/comments')
      .set('token', token)
      .send({
        PhotoId: photoId,
        comment: '',
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(422);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0]).toEqual('Comments cannot be empty.');
        done();
      });
  });

  it('should send response with 500 status code, because caption PhotoId not empty', done => {
    request(app)
      .post('/comments')
      .set('token', token)
      .send({
        PhotoId: '',
        comment: 'test comment'
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(500);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Internal server error');
        done();
      });
  });

})


afterAll((done) => {
    sequelize.queryInterface.bulkDelete('Comments', {})
        .then(() => {
            return done();
        })
        .catch((err) => {
            done(err);
        })
    sequelize.queryInterface.bulkDelete('Photos', {})
        .then(() => {
            return done();
        })
        .catch((err) => {
            done(err);
        })
    sequelize.queryInterface.bulkDelete('Users', {})
        .then(() => {
            return done();
        })
        .catch((err) => {
            done(err);
        })
})