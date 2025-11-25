const request = require('supertest');
const app = require('../src/app');
const dataStore = require('../src/utils/dataStore');

describe('Tenant API', () => {
  let tenantToken, tenantUserId;

  beforeEach(async () => {
    dataStore.clear();

    // Create and login as tenant
    const registerRes = await request(app)
      .post('/api/users/register')
      .send({
        email: 'tenant@example.com',
        password: 'password123',
        firstName: 'Ten',
        lastName: 'Ant',
        role: 'tenant'
      });
    tenantUserId = registerRes.body.id;

    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'tenant@example.com',
        password: 'password123'
      });
    
    tenantToken = loginRes.body.token;
  });

  describe('POST /api/tenants', () => {
    test('should create a tenant profile', async () => {
      const res = await request(app)
        .post('/api/tenants')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          employmentStatus: 'employed',
          employer: 'Tech Corp',
          annualIncome: 75000
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.userId).toBe(tenantUserId);
      expect(res.body.employer).toBe('Tech Corp');
    });

    test('should not create duplicate tenant profile', async () => {
      await request(app)
        .post('/api/tenants')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          employmentStatus: 'employed',
          employer: 'Tech Corp'
        });

      const res = await request(app)
        .post('/api/tenants')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          employmentStatus: 'employed',
          employer: 'Another Corp'
        });

      expect(res.statusCode).toBe(409);
    });
  });

  describe('GET /api/tenants/me', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/tenants')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          employmentStatus: 'employed',
          employer: 'Tech Corp',
          annualIncome: 75000
        });
    });

    test('should get my tenant profile', async () => {
      const res = await request(app)
        .get('/api/tenants/me')
        .set('Authorization', `Bearer ${tenantToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.employer).toBe('Tech Corp');
    });
  });

  describe('POST /api/tenants/:id/references', () => {
    let tenantId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/tenants')
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          employmentStatus: 'employed',
          employer: 'Tech Corp'
        });
      tenantId = createRes.body.id;
    });

    test('should add reference to tenant profile', async () => {
      const res = await request(app)
        .post(`/api/tenants/${tenantId}/references`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .send({
          name: 'Jane Smith',
          relationship: 'Former Landlord',
          phone: '555-1234',
          email: 'jane@example.com'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.references.length).toBe(1);
      expect(res.body.references[0].name).toBe('Jane Smith');
    });
  });
});
