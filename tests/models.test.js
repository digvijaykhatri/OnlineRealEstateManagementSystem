const { User, Property, RentalAgreement, Tenant } = require('../src/models');

describe('User Model', () => {
  test('should create a user with default values', () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });

    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.role).toBe('tenant');
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeDefined();
  });

  test('should hash password', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });

    const originalPassword = user.password;
    await user.hashPassword();

    expect(user.password).not.toBe(originalPassword);
    expect(user.password.length).toBeGreaterThan(20);
  });

  test('should compare password correctly', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });

    await user.hashPassword();
    
    expect(await user.comparePassword('password123')).toBe(true);
    expect(await user.comparePassword('wrongpassword')).toBe(false);
  });

  test('should return JSON without password', () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });

    const json = user.toJSON();
    
    expect(json.email).toBe('test@example.com');
    expect(json.password).toBeUndefined();
  });

  test('should return full name', () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });

    expect(user.getFullName()).toBe('John Doe');
  });
});

describe('Property Model', () => {
  test('should create a property with default values', () => {
    const property = new Property({
      title: 'Beautiful Apartment',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      price: 2000,
      ownerId: 'owner-123'
    });

    expect(property.title).toBe('Beautiful Apartment');
    expect(property.propertyType).toBe('apartment');
    expect(property.status).toBe('available');
    expect(property.rentOrSale).toBe('rent');
    expect(property.amenities).toEqual([]);
  });

  test('should check if property is available', () => {
    const property = new Property({
      title: 'Test Property',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      price: 2000,
      ownerId: 'owner-123'
    });

    expect(property.isAvailable()).toBe(true);
    
    property.status = 'rented';
    expect(property.isAvailable()).toBe(false);
  });

  test('should update status', () => {
    const property = new Property({
      title: 'Test Property',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      price: 2000,
      ownerId: 'owner-123'
    });

    property.updateStatus('rented');
    expect(property.status).toBe('rented');
  });

  test('should throw error for invalid status', () => {
    const property = new Property({
      title: 'Test Property',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      price: 2000,
      ownerId: 'owner-123'
    });

    expect(() => property.updateStatus('invalid')).toThrow('Invalid status: invalid');
  });

  test('should return summary', () => {
    const property = new Property({
      title: 'Test Property',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      price: 2000,
      ownerId: 'owner-123'
    });

    const summary = property.getSummary();
    expect(summary.title).toBe('Test Property');
    expect(summary.address).toBe('123 Main St');
    expect(summary.city).toBe('New York');
  });
});

describe('RentalAgreement Model', () => {
  test('should create an agreement with default values', () => {
    const agreement = new RentalAgreement({
      propertyId: 'property-123',
      tenantId: 'tenant-123',
      landlordId: 'landlord-123',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      monthlyRent: 2000
    });

    expect(agreement.status).toBe('draft');
    expect(agreement.signedByTenant).toBe(false);
    expect(agreement.signedByLandlord).toBe(false);
  });

  test('should sign by tenant', () => {
    const agreement = new RentalAgreement({
      propertyId: 'property-123',
      tenantId: 'tenant-123',
      landlordId: 'landlord-123',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      monthlyRent: 2000,
      status: 'pending'
    });

    agreement.signByTenant();
    expect(agreement.signedByTenant).toBe(true);
    expect(agreement.isFullySigned()).toBe(false);
  });

  test('should activate when fully signed', () => {
    const agreement = new RentalAgreement({
      propertyId: 'property-123',
      tenantId: 'tenant-123',
      landlordId: 'landlord-123',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      monthlyRent: 2000,
      status: 'pending'
    });

    agreement.signByTenant();
    agreement.signByLandlord();
    
    expect(agreement.isFullySigned()).toBe(true);
    expect(agreement.status).toBe('active');
    expect(agreement.signedAt).toBeDefined();
  });

  test('should terminate agreement', () => {
    const agreement = new RentalAgreement({
      propertyId: 'property-123',
      tenantId: 'tenant-123',
      landlordId: 'landlord-123',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      monthlyRent: 2000,
      status: 'active'
    });

    agreement.terminate('Lease violation');
    
    expect(agreement.status).toBe('terminated');
    expect(agreement.terminationReason).toBe('Lease violation');
  });
});

describe('Tenant Model', () => {
  test('should create a tenant with default values', () => {
    const tenant = new Tenant({
      userId: 'user-123'
    });

    expect(tenant.userId).toBe('user-123');
    expect(tenant.employmentStatus).toBe('employed');
    expect(tenant.references).toEqual([]);
    expect(tenant.rentalHistory).toEqual([]);
  });

  test('should check if tenant has active rental', () => {
    const tenant = new Tenant({
      userId: 'user-123'
    });

    expect(tenant.hasActiveRental()).toBe(false);

    tenant.currentPropertyId = 'property-123';
    tenant.currentAgreementId = 'agreement-123';
    
    expect(tenant.hasActiveRental()).toBe(true);
  });

  test('should add rental history', () => {
    const tenant = new Tenant({
      userId: 'user-123'
    });

    tenant.addRentalHistory({
      propertyId: 'property-123',
      agreementId: 'agreement-123',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      landlordId: 'landlord-123'
    });

    expect(tenant.rentalHistory.length).toBe(1);
    expect(tenant.rentalHistory[0].propertyId).toBe('property-123');
  });

  test('should add reference', () => {
    const tenant = new Tenant({
      userId: 'user-123'
    });

    tenant.addReference({
      name: 'Jane Smith',
      relationship: 'Former Landlord',
      phone: '555-1234',
      email: 'jane@example.com'
    });

    expect(tenant.references.length).toBe(1);
    expect(tenant.references[0].name).toBe('Jane Smith');
  });

  test('should update and clear current rental', () => {
    const tenant = new Tenant({
      userId: 'user-123'
    });

    tenant.updateCurrentRental('property-123', 'agreement-123');
    expect(tenant.currentPropertyId).toBe('property-123');
    expect(tenant.currentAgreementId).toBe('agreement-123');

    tenant.clearCurrentRental();
    expect(tenant.currentPropertyId).toBeNull();
    expect(tenant.currentAgreementId).toBeNull();
  });
});
