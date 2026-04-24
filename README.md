# PropFlow - Property Management System

A modern, mobile-first property management application for small landlords in Costa Rica and the EU. Built with .NET 10 Web API backend and React 19 frontend.

## 🏗️ Architecture

- **Backend**: .NET 10 Web API with Clean Architecture
- **Frontend**: React 19 + TypeScript + Vite
- **Database**: MySQL
- **Authentication**: JWT Bearer tokens

## 🚀 Quick Start

### Prerequisites

- .NET 10 SDK
- Node.js 18+ and npm
- MySQL 8.0+

### 1. Automated Setup

Run the setup script to initialize the project:

```bash
./setup.sh
```

### 2. Manual Setup

#### Database Setup

1. Install and start MySQL server
2. Create database and user:
```sql
CREATE DATABASE propflow_dev;
CREATE USER 'propflow'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON propflow_dev.* TO 'propflow'@'localhost';
FLUSH PRIVILEGES;
```

3. Apply EF Core migrations to create the database schema:
```bash
dotnet ef database update --project PropFlow.Infrastructure --startup-project PropFlow.Api
```

#### Backend Setup

1. Copy the development settings template:
```bash
cp PropFlow.Api/appsettings.Development.json.template PropFlow.Api/appsettings.Development.json
```

2. Update `PropFlow.Api/appsettings.Development.json` with your MySQL credentials:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=propflow_dev;User=propflow;Password=your_password;"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!"
  }
}
```

3. Run the backend:
```bash
dotnet run --project PropFlow.Api --urls "http://localhost:5050;https://localhost:5051"
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd propflow-web
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment template (optional):
```bash
cp .env.template .env.local
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` or `http://localhost:5174`.

## 📋 Features

### MVP Features Implemented

1. **Authentication**
   - Landlord registration and login
   - JWT-based authentication
   - Protected routes

2. **Properties Management**
   - CRUD operations for properties
   - Property details (name, address, city, country, notes)

3. **Rental Units Management**
   - CRUD operations for rental units within properties
   - Unit status tracking (Available, Occupied, Maintenance)
   - Monthly rent and currency management

4. **Tenants Management**
   - CRUD operations for tenants
   - Contact information and identification numbers
   - Notes and tenant history

5. **Contracts Management**
   - Link tenants to rental units
   - Contract terms (start/end dates, rent, deposit)
   - Contract status tracking (Active, Finished, Cancelled)

6. **Payments Management**
   - Track rent payments per contract
   - Payment status (Pending, Paid, Late)
   - Due dates and payment history

7. **Maintenance Requests**
   - Property and unit maintenance tracking
   - Priority levels (Low, Medium, High)
   - Status tracking (Open, InProgress, Closed)

8. **Dashboard**
   - Summary statistics
   - Pending and late payments overview
   - Open maintenance requests

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new landlord
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property
- `GET /api/properties/{id}` - Get property details
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

### Rental Units
- `GET /api/properties/{propertyId}/units` - List units for property
- `POST /api/properties/{propertyId}/units` - Create unit
- `PUT /api/units/{id}` - Update unit
- `DELETE /api/units/{id}` - Delete unit

### Tenants
- `GET /api/tenants` - List tenants
- `POST /api/tenants` - Create tenant
- `PUT /api/tenants/{id}` - Update tenant
- `DELETE /api/tenants/{id}` - Delete tenant

### Contracts
- `GET /api/contracts` - List contracts
- `POST /api/contracts` - Create contract
- `PUT /api/contracts/{id}` - Update contract
- `DELETE /api/contracts/{id}` - Delete contract

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Create payment
- `PUT /api/payments/{id}` - Update payment
- `DELETE /api/payments/{id}` - Delete payment

### Maintenance Requests
- `GET /api/maintenance-requests` - List maintenance requests
- `POST /api/maintenance-requests` - Create maintenance request
- `PUT /api/maintenance-requests/{id}` - Update maintenance request
- `DELETE /api/maintenance-requests/{id}` - Delete maintenance request

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## 🛠️ Development

### Backend Structure
```
PropFlow.Api/          # Web API layer
PropFlow.Application/  # Business logic layer
PropFlow.Domain/       # Domain entities and interfaces
PropFlow.Infrastructure/ # Data access and external services
```

### Frontend Structure
```
src/
├── app/              # App configuration and routing
├── features/         # Feature-based modules
│   ├── auth/         # Authentication
│   ├── properties/   # Properties management
│   ├── units/        # Rental units
│   ├── tenants/      # Tenants management
│   ├── contracts/    # Contracts management
│   ├── payments/     # Payments tracking
│   ├── maintenance/  # Maintenance requests
│   └── dashboard/    # Dashboard and analytics
└── shared/           # Shared components and utilities
    ├── api/          # API client
    ├── components/   # Reusable UI components
    ├── types/        # TypeScript type definitions
    └── utils/        # Utility functions
```

## 🔒 Security

### Security Features
- JWT tokens for authentication
- Password hashing with BCrypt
- CORS protection
- Input validation and sanitization
- SQL injection prevention through Entity Framework

### Protected Files (Git Ignored)
- `PropFlow.Api/appsettings.Development.json` - Database credentials and JWT secret
- `PropFlow.Api/appsettings.Production.json` - Production secrets
- `propflow-web/.env.local` - Frontend environment variables

### Template Files (Safe to Commit)
- `PropFlow.Api/appsettings.Development.json.template` - Configuration template
- `propflow-web/.env.template` - Environment template

### Security Checklist

**Before Deployment:**
- [ ] Replace JWT secret with strong, unique key (32+ characters)
- [ ] Ensure database passwords are not hardcoded
- [ ] Verify sensitive files are in `.gitignore`
- [ ] Enable HTTPS in production
- [ ] Configure CORS for trusted domains only

### Known Vulnerabilities

**AutoMapper 12.0.1 - High Severity DoS Vulnerability**
- **Issue**: CVE-2026-32933 - Denial of Service via uncontrolled recursion
- **Risk**: StackOverflowException with deeply nested objects (25,000+ levels)
- **Mitigation**: Input validation limits object nesting depth
- **Status**: Acceptable for MVP with proper validation

**Upgrade Options:**
- AutoMapper 15.1.1+ (paid license required)
- Replace with manual mapping for production

## 📱 Mobile-First Design

The application is designed with a mobile-first approach, ensuring optimal user experience on smartphones and tablets while maintaining full functionality on desktop devices.

## 🚀 Deployment

### Backend Deployment
1. Set production connection string and JWT secret in environment variables
2. Build the application: `dotnet publish -c Release`
3. Deploy to your hosting provider

### Frontend Deployment
1. Set production API URL: `VITE_API_BASE_URL=https://your-api.com/api`
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your static hosting provider

## 🔧 Troubleshooting

### Common Issues

**"Failed to restore" errors:**
```bash
# Clear NuGet cache and restore
dotnet nuget locals all --clear
dotnet restore
```

**"Invalid email or password" after setup:**
- Ensure JWT secret is set in `appsettings.Development.json`
- Restart the backend after configuration changes

**Frontend "vite: command not found":**
```bash
cd propflow-web
npm install
```

**CORS errors:**
- Verify backend is running on port 5050
- Check CORS configuration includes frontend port (5173/5174)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**PropFlow** - Simplifying property management for small landlords 🏠
