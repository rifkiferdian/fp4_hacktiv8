const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

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

const socialmediaData = {
    name: "Google",
    social_media_url: "https://www.google.com"
}
  
let token;
let token2;
let socialmediaId;

beforeAll(() => {
  return request(app).post('/users/register').send(userData).then(res => {
    return request(app).post('/users/login').send({
      email: userData.email,
      password: userData.password
    }).then(res => {
        token = res.body.token;
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

describe('POST /socialmedias', () => {
  it('should send response with 201 status code', done => {
    request(app)
      .post('/socialmedias')
      .set('token', token)
      .send(socialmediaData)
      .end((err, res) => {
        if (err) done(err);
        socialmediaId = res.body.social_media.id;
        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('social_media');
        expect(res.body.social_media).toHaveProperty('id');
        expect(res.body.social_media).toHaveProperty('name');
        expect(res.body.social_media).toHaveProperty('social_media_url');
        expect(res.body.social_media).toHaveProperty('UserId');
        expect(res.body.social_media.name).toEqual(socialmediaData.name);
        expect(res.body.social_media.social_media_url).toEqual(socialmediaData.social_media_url);
        done();
      });
  });

  it('should send response with 422 status code, because name not empty', done => {
    request(app)
      .post('/socialmedias')
      .set('token', token)
      .send({
            name: "",
            social_media_url: "https://www.google.com"
        })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(422);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0]).toEqual('name cannot be empty.');
        done();
    });
  });
  
  it('should send response with 422 status code, because social_media_url not empty', done => {
    request(app)
      .post('/socialmedias')
      .set('token', token)
      .send({
          name: "test",
          social_media_url: ""
        })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toEqual(422);
        expect(typeof res.body).toEqual('object');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0]).toEqual('social_media_url cannot be empty.');
        done();
      });
  });

})

describe('GET /socialmedias', () => {
    it('should send response with 200 status code', done => {
      request(app)
        .get('/socialmedias')
        .set('token', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual('object');
          expect(typeof res.body.social_medias).toEqual('object');
          expect(res.body.social_medias[0]).toHaveProperty('id');
          expect(res.body.social_medias[0]).toHaveProperty('name');
          expect(res.body.social_medias[0]).toHaveProperty('social_media_url');
          expect(res.body.social_medias[0]).toHaveProperty('User');
          expect(res.body.social_medias[0].name).toEqual(socialmediaData.name);
          expect(res.body.social_medias[0].social_media_url).toEqual(socialmediaData.social_media_url);
          done();
        });
    });
  
    it('should send response with 401 status code, because token invalid', done => {
      request(app)
        .get('/socialmedias')
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

describe('PUT /socialmedias/socialmediaId', () => {
    it('should send response with 200 status code', done => {
      request(app)
        .put(`/socialmedias/${socialmediaId}`)
        .set('token', token)
        .send({
            name: "yahoo",
            social_media_url: "https://www.yahoo.com"
          })
        .end((err, res) => {
          if (err) done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.body).toEqual('object');
            expect(res.body).toHaveProperty('social_media');
            expect(res.body.social_media).toHaveProperty('id');
            expect(res.body.social_media).toHaveProperty('name');
            expect(res.body.social_media).toHaveProperty('social_media_url');
            expect(res.body.social_media).toHaveProperty('UserId');
            expect(res.body.social_media.name).toEqual('yahoo');
            expect(res.body.social_media.social_media_url).toEqual("https://www.yahoo.com");
            done();
        });
    });
  
    it('should send response with 401 status code, because token invalid', done => {
      request(app)
        .put(`/socialmedias/${socialmediaId}`)
        .send({
            name: "facebook",
            social_media_url: "https://www.facebook.com"
          })
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
  
    it('should send response with 403 status code, because ID socialmedia not found', done => {
      request(app)
        .put(`/socialmedias/999999`)
        .send({
            name: "facebook",
            social_media_url: "https://www.facebook.com"
          })
        .set('token', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).toEqual(403);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toEqual('Social Media tidak ditemukan ...!');
          expect(typeof res.body.message).toEqual('string');
          done();
        });
    });
  
    it('should send response with 422 status code, because name not empty', done => {
      request(app)
        .put(`/socialmedias/${socialmediaId}`)
        .send({
            name: "",
            social_media_url: "https://www.facebook.com"
        })
        .set('token', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).toEqual(422);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('errors');
          expect(res.body.status).toEqual('fail');
          expect(res.body.errors[0]).toEqual('name cannot be empty.');
          done();
        });
    });
})

describe('DELETE /socialmedias/socialmediaId', () => {
    it('should send response with 403 status code, cause another user try to delete the socialmedias', done => {
      request(app)
        .delete(`/socialmedias/${socialmediaId}`)
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
        .delete(`/socialmedias/${socialmediaId}`)
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
        .delete(`/socialmedias/${socialmediaId}`)
        .set('token', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toEqual('Your social media has been successfully deleted.');
          done();
        });
    });
  
    it('should send response with 403 status code, because socialmediaId not found', done => {
      request(app)
        .delete(`/socialmedias/${socialmediaId}`)
        .set('token', token)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).toEqual(403);
          expect(typeof res.body).toEqual('object');
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toEqual('Social Media tidak ditemukan ...!');
          expect(typeof res.body.message).toEqual('string');
          done();
        });
    });
});

afterAll((done) => {
    sequelize.queryInterface.bulkDelete('SocialMedia', {})
        .then(() => {
            return done();
        })
        .catch((err) => {
            done(err);
        })
})

afterAll((done) => {
    sequelize.queryInterface.bulkDelete('Users', {})
        .then(() => {
            return done();
        })
        .catch((err) => {
            done(err);
        })
})