const request = require('supertest');
const app = require('../src/app');
const dataStore = require('../src/utils/dataStore');

describe('Rental Agreement API', () => {
  let landlordToken, tenantToken;
  let landlordId, tenantId, propertyId;

  beforeEach(async () => {
    dataStore.clear();

    // Create landlord
    const landlordReg = await request(app)
      .post('/api/users/register')
      .send({
        email: 'landlord@example.com',
        password: 'password123',
        firstName: 'Land',
        lastName: 'Lord',
        role: 'landlord'
      });
    landlordId = landlordReg.body.id;

    const landlordLogin = await request(app)
      .post('/api/users/login')
      .send({
        email: 'landlord@example.com',
        password: 'password123'
      });
    landlordToken = landlordLogin.body.token;

    // Create tenant
    const tenantReg = await request(app)
      .post('/api/users/register')
      .send({
        email: 'tenant@example.com',
        password: 'password123',
        firstName: 'Ten',
        lastName: 'Ant',
        role: 'tenant'
      });
    tenantId = tenantReg.body.id;

    const tenantLogin = await request(app)
      .post('/api/users/login')
      .send({
        email: 'tenant@example.com',
        password: 'password123'
      });
    tenantToken = tenantLogin.body.token;

    // Create property
    const propertyRes = await request(app)
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
    propertyId = propertyRes.body.id;
  });

  describe('POST /api/agreements', () => {
    test('should create a rental agreement', async () => {
      const res = await request(app)
        .post('/api/agreements')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({
          propertyId,
          tenantId,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          monthlyRent: 2000,
          securityDeposit: 4000
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.propertyId).toBe(propertyId);
      expect(res.body.tenantId).toBe(tenantId);
      expect(res.body.status).toBe('draft');
    });

    test('should not create agreement for non-existent property', async () => {
      const res = await request(app)
        .post('/api/agreements')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({
          propertyId: 'non-existent-id',
          tenantId,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          monthlyRent: 2000
        });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('Agreement Signing Flow', () => {
    let agreementId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/agreements')
        .set('Authorization', `Bearer ${landlordToken}`)
        .send({
          propertyId,
          tenantId,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          monthlyRent: 2000
        });
      agreementId = createRes.body.id;
    });

    test('should send agreement for signing', async () => {
      const res = await request(app)
        .post(`/api/agreements/${agreementId}/send-for-signing`)
        .set('Authorization', `Bearer ${landlordToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('pending');
    });

    test('should sign agreement by landlord', async () => {
      // First send for signing
      await request(app)
        .post(`/api/agreements/${agreementId}/send-for-signing`)
        .set('Authorization', `Bearer ${landlordToken}`);

      const res = await request(app)
        .post(`/api/agreements/${agreementId}/sign/landlord`)
        .set('Authorization', `Bearer ${landlordToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.signedByLandlord).toBe(true);
    });

    test('should sign agreement by tenant', async () => {
      // First send for signing
      await request(app)
        .post(`/api/agreements/${agreementId}/send-for-signing`)
        .set('Authorization', `Bearer ${landlordToken}`);

      const res = await request(app)
        .post(`/api/agreements/${agreementId}/sign/tenant`)
        .set('Authorization', `Bearer ${tenantToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.signedByTenant).toBe(true);
    });

    test('should activate agreement when both sign', async () => {
      // Send for signing
      await request(app)
        .post(`/api/agreements/${agreementId}/send-for-signing`)
        .set('Authorization', `Bearer ${landlordToken}`);

      // Landlord signs
      await request(app)
        .post(`/api/agreements/${agreementId}/sign/landlord`)
        .set('Authorization', `Bearer ${landlordToken}`);

      // Tenant signs
      const res = await request(app)
        .post(`/api/agreements/${agreementId}/sign/tenant`)
        .set('Authorization', `Bearer ${tenantToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('active');
      expect(res.body.signedByLandlord).toBe(true);
      expect(res.body.signedByTenant).toBe(true);
    });
  });
});
