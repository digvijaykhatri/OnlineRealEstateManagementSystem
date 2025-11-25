# Online Real Estate Management System

A comprehensive real estate management system built with Spring Boot that facilitates property listing, rental agreements, and tenant management.

## Features

- **Property Listing**: Create, update, search, and manage property listings
- **Rental Agreements**: Manage rental contracts between property owners and tenants
- **Tenant Management**: Handle tenant profiles with emergency contacts and employment information
- **User Management**: Support for different user roles (Admin, Property Owner, Tenant)
- **System Oversight**: Comprehensive API for monitoring and managing all aspects of the system

## Technology Stack

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (development)
- Maven

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. Access the API at `http://localhost:8080`
5. Access H2 Console at `http://localhost:8080/h2-console`

### Running Tests

```bash
mvn test
```

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/role/{role}` - Get users by role
- `PUT /api/users/{id}` - Update user
- `PATCH /api/users/{id}/activate` - Activate user
- `PATCH /api/users/{id}/deactivate` - Deactivate user
- `DELETE /api/users/{id}` - Delete user

### Properties
- `POST /api/properties` - Create a new property
- `GET /api/properties` - Get all properties
- `GET /api/properties/{id}` - Get property by ID
- `GET /api/properties/available` - Get available properties
- `GET /api/properties/city/{city}` - Get properties by city
- `GET /api/properties/type/{type}` - Get properties by type
- `GET /api/properties/price?minPrice=&maxPrice=` - Get properties by price range
- `PUT /api/properties/{id}` - Update property
- `PATCH /api/properties/{id}/status` - Update property status
- `DELETE /api/properties/{id}` - Delete property

### Tenants
- `POST /api/tenants` - Create a new tenant
- `GET /api/tenants` - Get all tenants
- `GET /api/tenants/{id}` - Get tenant by ID
- `GET /api/tenants/user/{userId}` - Get tenant by user ID
- `PUT /api/tenants/{id}` - Update tenant
- `DELETE /api/tenants/{id}` - Delete tenant

### Rental Agreements
- `POST /api/rental-agreements` - Create a new rental agreement
- `GET /api/rental-agreements` - Get all agreements
- `GET /api/rental-agreements/{id}` - Get agreement by ID
- `GET /api/rental-agreements/property/{propertyId}` - Get agreements by property
- `GET /api/rental-agreements/tenant/{tenantId}` - Get agreements by tenant
- `GET /api/rental-agreements/active` - Get active agreements
- `GET /api/rental-agreements/expired` - Get expired agreements
- `PATCH /api/rental-agreements/{id}/activate` - Activate agreement
- `PATCH /api/rental-agreements/{id}/terminate` - Terminate agreement
- `DELETE /api/rental-agreements/{id}` - Delete agreement

## Data Models

### User Roles
- `ADMIN` - System administrator
- `PROPERTY_OWNER` - Property owner who can list properties
- `TENANT` - Tenant who can rent properties

### Property Types
- `APARTMENT`
- `HOUSE`
- `CONDO`
- `TOWNHOUSE`
- `STUDIO`
- `COMMERCIAL`

### Property Status
- `AVAILABLE`
- `RENTED`
- `PENDING`
- `MAINTENANCE`

### Agreement Status
- `PENDING`
- `ACTIVE`
- `EXPIRED`
- `TERMINATED`
- `RENEWED`