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

const photoDataUpdate = {
  poster_image_url: "https://www.google.com/1",
  title: "Foto Google 1",
  caption: "Ini adalah foto google 1"
}

let token;
let token2;
let photoId;

beforeAll(() => {
  return request(app).post('/users/register').send(userData).then(res => {
    return request(app).post('/users/login').send({
      email: userData.email,
      password: userData.password
    }).then(res => token = res.body.token);
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

describe('POST /photos', () => {
  it('should send response with 201 status code', done => {
    request(app)
      .post('/photos')
      .set('token', token)
      .send(photoData)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(201);
        photoId = res.body.id;
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('poster_image_url');
        expect(res.body).toHaveProperty('title');
        expect(res.body).toHaveProperty('caption');
        expect(res.body).toHaveProperty('UserId');
        expect(res.body.title).toEqual(photoData.title);
        expect(res.body.caption).toEqual(photoData.caption);
        expect(res.body.poster_image_url).toEqual(photoData.poster_image_url);
        done();
      });
  });

  it('should send response with 422 status code, because title not empty', done => {
    request(app)
      .post('/photos')
      .set('token', token)
      .send({
        title: '',
        caption: 'test caption',
        poster_image_url: photoData.poster_image_url
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(422);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0]).toEqual('Title cannot be empty.');
        done();
      });
  });

  it('should send response with 422 status code, because caption empty and url invalid', done => {
    request(app)
      .post('/photos')
      .set('token', token)
      .send({
        title: 'ini title',
        caption: '',
        poster_image_url: 'test url'
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(422);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0]).toEqual('Caption cannot be empty.');
        expect(res.body.errors[1]).toEqual('poster_image_url invalid.');
        done();
      });
  });
})

describe('GET /photos', () => {
  it('should send response with 201 status code', done => {
    request(app)
      .get('/photos')
      .set('token', token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual('object');
        expect(typeof res.body.photos).toEqual('object');
        expect(res.body.photos[0]).toHaveProperty('Comments');
        expect(res.body.photos[0]).toHaveProperty('User');
        expect(res.body.photos[0]).toHaveProperty('title');
        expect(res.body.photos[0]).toHaveProperty('caption');
        expect(res.body.photos[0]).toHaveProperty('UserId');
        expect(res.body.photos[0].title).toEqual(photoData.title);
        expect(res.body.photos[0].caption).toEqual(photoData.caption);
        expect(res.body.photos[0].poster_image_url).toEqual(photoData.poster_image_url);
        done();
      });
  });

  it('should send response with 401 status code, because token invalid', done => {
    request(app)
      .get('/photos')
      .set('token', 'aosdjosajdoasodjasodjsao')
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(401);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('message');
        expect(res.body.status).toEqual('fail');
        expect(res.body.message).toEqual('Invalid token given')
        done();
      });
  });
})

describe('PUT /photos/photoId', () => {
  it('should send response with 200 status code', done => {
    request(app)
      .put(`/photos/${photoId}`)
      .set('token', token)
      .send(photoDataUpdate)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual('object');
        expect(typeof res.body.photo).toEqual('object');
        expect(res.body.photo).toHaveProperty('title');
        expect(res.body.photo).toHaveProperty('caption');
        expect(res.body.photo).toHaveProperty('UserId');
        expect(res.body.photo).toHaveProperty('createdAt');
        expect(res.body.photo).toHaveProperty('updatedAt');
        expect(res.body.photo.title).toEqual(photoDataUpdate.title);
        expect(res.body.photo.caption).toEqual(photoDataUpdate.caption);
        expect(res.body.photo.poster_image_url).toEqual(photoDataUpdate.poster_image_url);
        done();
      });
  });

  it('should send response with 401 status code, because token invalid', done => {
    request(app)
      .put(`/photos/${photoId}`)
      .send(photoDataUpdate)
      .set('token', 'aosdjosajdoasodjasodjsao')
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(401);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('message');
        expect(res.body.status).toEqual('fail');
        expect(res.body.message).toEqual('Invalid token given')
        done();
      });
  });

  it('should send response with 404 status code, because photo not found', done => {
    request(app)
      .put(`/photos/999999`)
      .send(photoDataUpdate)
      .set('token', token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(404);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Id not found...!');
        expect(typeof res.body.message).toEqual('string');
        done();
      });
  });

  it('should send response with 422 status code, because caption, title, and poster_image_url not valid', done => {
    request(app)
      .put(`/photos/${photoId}`)
      .send({
        title: '',
        caption: '',
        poster_image_url: 'aksdokasod'
      })
      .set('token', token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(422);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('errors');
        expect(res.body.status).toEqual('fail');
        expect(res.body.errors[0]).toEqual('Title cannot be empty.');
        expect(res.body.errors[1]).toEqual('Caption cannot be empty.');
        expect(res.body.errors[2]).toEqual('poster_image_url invalid.');
        done();
      });
  });
})

describe('DELETE /photos/photoId', () => {
  it('should send response with 403 status code, cause another user try to delete the photo', done => {
    request(app)
      .delete(`/photos/${photoId}`)
      .set('token', token2)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(403);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Access Denied...!');
        done();
      });
  });

  it('should send response with 401 status code, because token invalid', done => {
    request(app)
      .delete(`/photos/${photoId}`)
      .set('token', 'aosdjaoskdoaskd')
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(401);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('message');
        expect(res.body.status).toEqual('fail');
        expect(res.body.message).toEqual('Invalid token given')
        done();
      });
  });

  it('should send response with 200 status code', done => {
    request(app)
      .delete(`/photos/${photoId}`)
      .set('token', token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Your photo has been successfully deleted');
        done();
      });
  });

  it('should send response with 404 status code, because photo not found', done => {
    request(app)
      .delete(`/photos/${photoId}`)
      .set('token', token)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(404);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Id not found...!');
        expect(typeof res.body.message).toEqual('string');
        done();
      });
  });
});

afterAll((done) => {
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