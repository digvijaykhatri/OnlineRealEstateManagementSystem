const request = require('supertest');
const app = require('../src/app');
const dataStore = require('../src/utils/dataStore');
const { User, Property, RentalAgreement, Tenant } = require('../src/models');

describe('Admin API', () => {
  let adminToken;

  beforeEach(async () => {
    dataStore.clear();

    // Create and login as admin
    const user = new User({
      email: 'admin@example.com',
      password: 'password123',
      firstName: 'Ad',
      lastName: 'Min',
      role: 'admin'
    });
    await user.hashPassword();
    dataStore.createUser(user);

    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });
    
    adminToken = loginRes.body.token;

    // Add some test data
    const landlord = new User({
      email: 'landlord@example.com',
      password: 'password123',
      firstName: 'Land',
      lastName: 'Lord',
      role: 'landlord'
    });
    await landlord.hashPassword();
    dataStore.createUser(landlord);

    const tenant = new User({
      email: 'tenant@example.com',
      password: 'password123',
      firstName: 'Ten',
      lastName: 'Ant',
      role: 'tenant'
    });
    await tenant.hashPassword();
    dataStore.createUser(tenant);

    const property = new Property({
      title: 'Test Property',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      price: 2000,
      ownerId: landlord.id
    });
    dataStore.createProperty(property);

    const tenantProfile = new Tenant({
      userId: tenant.id,
      employmentStatus: 'employed',
      annualIncome: 50000
    });
    dataStore.createTenant(tenantProfile);
  });

  describe('GET /api/admin/dashboard', () => {
    test('should get system dashboard', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.totalUsers).toBe(3);
      expect(res.body.totalProperties).toBe(1);
    });

    test('should not allow non-admin to access dashboard', async () => {
      // Login as tenant
      const tenantLogin = await request(app)
        .post('/api/users/login')
        .send({
          email: 'tenant@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${tenantLogin.body.token}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/admin/reports/users', () => {
    test('should get user report', async () => {
      const res = await request(app)
        .get('/api/admin/reports/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.totalUsers).toBe(3);
      expect(res.body.usersByRole).toBeDefined();
    });
  });

  describe('GET /api/admin/reports/properties', () => {
    test('should get property report', async () => {
      const res = await request(app)
        .get('/api/admin/reports/properties')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.totalProperties).toBe(1);
      expect(res.body.byStatus).toBeDefined();
    });
  });

  describe('GET /api/admin/reports/full', () => {
    test('should get full system report', async () => {
      const res = await request(app)
        .get('/api/admin/reports/full')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.dashboard).toBeDefined();
      expect(res.body.users).toBeDefined();
      expect(res.body.properties).toBeDefined();
      expect(res.body.agreements).toBeDefined();
      expect(res.body.tenants).toBeDefined();
      expect(res.body.generatedAt).toBeDefined();
    });
  });
});
