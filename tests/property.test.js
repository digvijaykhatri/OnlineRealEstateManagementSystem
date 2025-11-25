const request = require('supertest');
const app = require('../src/app');
const dataStore = require('../src/utils/dataStore');

describe('Property API', () => {
  let landlordToken;
  let landlordId;

  beforeEach(async () => {
    dataStore.clear();

    // Create and login as landlord
    await request(app)
      .post('/api/users/register')
      .send({
        email: 'landlord@example.com',
        password: 'password123',
        firstName: 'Land',
        lastName: 'Lord',
        role: 'landlord'
      });

    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'landlord@example.com',
        password: 'password123'
      });
    
    landlordToken = loginRes.body.token;
    landlordId = loginRes.body.user.id;
  });

  describe('POST /api/properties', () => {
    test('should create a property as landlord', async () => {
      const res = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({
          title: 'Beautiful Apartment',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          price: 2000,
          bedrooms: 2,
          bathrooms: 1
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('Beautiful Apartment');
      expect(res.body.ownerId).toBe(landlordId);
    });

    test('should not create property without authentication', async () => {
      const res = await request(app)
        .post('/api/properties')
        .send({
          title: 'Beautiful Apartment',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          price: 2000
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/properties', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({
          title: 'Beautiful Apartment',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          price: 2000
        });
    });

    test('should get all properties', async () => {
      const res = await request(app)
        .get('/api/properties');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
    });

    test('should get available properties', async () => {
      const res = await request(app)
        .get('/api/properties/available');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].status).toBe('available');
    });

    test('should search properties by city', async () => {
      const res = await request(app)
        .get('/api/properties/search')
        .query({ city: 'New York' });

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe('PUT /api/properties/:id', () => {
    let propertyId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({
          title: 'Beautiful Apartment',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          price: 2000
        });
      
      propertyId = createRes.body.id;
    });

    test('should update property', async () => {
      const res = await request(app)
        .put(`/api/properties/${propertyId}`)
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({
          price: 2500
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(2500);
    });
  });
});
