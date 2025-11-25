# Online Real Estate Management System

A comprehensive REST API for managing real estate operations including property listings, rental agreements, tenant management, and system administration.

## Features

### Property Management
- **Property Listing**: Create, update, and manage property listings
- **Property Search**: Search properties by city, state, type, price range, and more
- **Property Status**: Track property availability (available, rented, sold, maintenance)
- **Amenities & Images**: Add amenities and images to property listings

### Rental Agreements
- **Agreement Creation**: Create rental agreements between landlords and tenants
- **Digital Signing**: Sign agreements digitally by both parties
- **Agreement Workflow**: Draft → Pending → Active → Terminated/Expired
- **Termination**: Terminate active agreements with reason tracking

### Tenant Management
- **Tenant Profiles**: Create and manage tenant profiles
- **Employment & Income**: Track employment status and annual income
- **Rental History**: Maintain complete rental history for tenants
- **References**: Add and manage tenant references

### User Management
- **Authentication**: JWT-based authentication
- **Role-Based Access**: Support for Admin, Landlord, Tenant, and Agent roles
- **Profile Management**: Update user profiles and passwords

### System Oversight (Admin Dashboard)
- **Dashboard**: System-wide statistics and metrics
- **Reports**: Detailed reports on users, properties, agreements, and tenants
- **Activity Summary**: Track recent system activity

## Installation

```bash
# Install dependencies
npm install

# Start the server
npm start

# Run tests
npm test
```

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update password

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/available` - Get available properties
- `GET /api/properties/search` - Search properties with filters
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (Landlord/Admin)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Rental Agreements
- `POST /api/agreements` - Create rental agreement
- `GET /api/agreements/:id` - Get agreement by ID
- `POST /api/agreements/:id/send-for-signing` - Send for signing
- `POST /api/agreements/:id/sign/landlord` - Landlord sign
- `POST /api/agreements/:id/sign/tenant` - Tenant sign
- `POST /api/agreements/:id/terminate` - Terminate agreement

### Tenants
- `POST /api/tenants` - Create tenant profile
- `GET /api/tenants/me` - Get my tenant profile
- `PUT /api/tenants/me` - Update my profile
- `GET /api/tenants/:id/history` - Get rental history
- `POST /api/tenants/:id/references` - Add reference

### Admin
- `GET /api/admin/dashboard` - Get system dashboard
- `GET /api/admin/reports/users` - User report
- `GET /api/admin/reports/properties` - Property report
- `GET /api/admin/reports/agreements` - Agreement report
- `GET /api/admin/reports/tenants` - Tenant report
- `GET /api/admin/reports/full` - Complete system report

## User Roles

| Role | Permissions |
|------|-------------|
| Admin | Full system access, user management, all reports |
| Landlord | Create/manage properties, create agreements, view tenant profiles |
| Tenant | Create tenant profile, sign agreements, view rental history |
| Agent | Create/manage properties on behalf of landlords |

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Testing**: Jest, Supertest
- **Storage**: In-memory (can be replaced with database)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| JWT_SECRET | real-estate-management-secret-key | JWT signing secret |
| JWT_EXPIRES_IN | 24h | Token expiration time |

## License

ISC