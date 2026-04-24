# PropFlow - Property Management System

A modern, **mobile-first** property management application designed for small landlords in Costa Rica and the EU. Built with .NET 10 Web API backend and React 19 frontend with responsive design optimized for smartphones and tablets.

## 🏗️ Architecture

- **Backend**: .NET 10 Web API with Clean Architecture (Domain, Application, Infrastructure, API layers)
- **Frontend**: React 19 + TypeScript + Vite with mobile-first responsive design
- **Database**: MySQL with Entity Framework Core migrations
- **Authentication**: JWT Bearer tokens with secure password hashing (BCrypt)
- **API Documentation**: Swagger/OpenAPI with interactive testing

## 📱 Mobile-First Design

PropFlow is designed with a **mobile-first approach**:
- **Responsive Layout**: Optimized for smartphones (320px+), tablets, and desktop
- **Touch-Friendly**: Large tap targets and intuitive gestures
- **Fast Loading**: Optimized bundle size and lazy loading
- **Offline-Ready**: Prepared for future PWA capabilities
- **Modern UI**: Clean, intuitive interface following mobile design patterns

## 🚀 Quick Start

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 18+](https://nodejs.org/) and npm
- [MySQL 8.0+](https://dev.mysql.com/downloads/mysql/)

### Option 1: Automated Setup (Recommended)

```bash
# Clone and navigate to the project
cd PropFlow

# Run the automated setup script
./setup.sh

# Follow the prompts to configure your database credentials
```

### Option 2: Manual Setup

#### 1. Database Setup

Create the MySQL database and user:

```sql
CREATE DATABASE propflow_dev;
CREATE USER 'propflow'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON propflow_dev.* TO 'propflow'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. Backend Configuration

Copy and configure the development settings:

```bash
cp PropFlow.Api/appsettings.Development.json.template PropFlow.Api/appsettings.Development.json
```

Update `PropFlow.Api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=propflow_dev;User=propflow;Password=your_secure_password;"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretJWTKeyThatIsAtLeast32CharactersLong!"
  }
}
```

#### 3. Create Database Schema

Apply Entity Framework migrations:

```bash
dotnet ef database update --project PropFlow.Infrastructure --startup-project PropFlow.Api
```

#### 4. Start Backend

```bash
dotnet run --project PropFlow.Api --urls "http://localhost:5050;https://localhost:5051"
```

#### 5. Start Frontend

```bash
cd propflow-web
npm install
npm run dev
```

## 🎯 Access the Application

- **Frontend (Mobile-Optimized)**: http://localhost:5173 or http://localhost:5174
- **API Documentation**: http://localhost:5050/swagger
- **Backend API**: http://localhost:5050/api

## 📋 MVP Features

### Core Functionality

1. **🔐 Authentication**
   - Landlord registration and secure login
   - JWT-based session management
   - Protected routes and API endpoints

2. **🏠 Property Management**
   - Add, edit, and delete properties
   - Property details: name, address, city, country, notes
   - Mobile-optimized property cards and forms

3. **🏢 Rental Units**
   - Manage units within properties
   - Unit status tracking (Available, Occupied, Maintenance)
   - Monthly rent and currency management
   - Touch-friendly unit selection

4. **👥 Tenant Management**
   - Complete tenant profiles
   - Contact information and identification
   - Notes and communication history
   - Mobile-friendly contact cards

5. **📄 Contract Management**
   - Link tenants to rental units
   - Contract terms and conditions
   - Status tracking (Active, Finished, Cancelled)
   - Mobile contract viewer

6. **💰 Payment Tracking**
   - Rent payment management
   - Payment status (Pending, Paid, Late)
   - Due date notifications
   - Mobile payment interface

7. **🔧 Maintenance Requests**
   - Property and unit maintenance tracking
   - Priority levels and status management
   - Mobile-friendly request forms
   - Photo upload ready (future feature)

8. **📊 Dashboard**
   - Mobile-optimized summary cards
   - Key metrics at a glance
   - Quick action buttons
   - Responsive charts and statistics
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

### Backend Structure (Clean Architecture)
```
PropFlow.Api/          # Web API layer - Controllers, middleware, configuration
PropFlow.Application/  # Business logic - Services, DTOs, validation
PropFlow.Domain/       # Domain entities - Models, enums, interfaces  
PropFlow.Infrastructure/ # Data access - EF Core, repositories, external services
```

### Frontend Structure (Mobile-First)
```
src/
├── app/              # App configuration and routing
│   ├── contexts/     # React contexts (Auth, Theme)
│   └── styles/       # Global styles and CSS framework
├── features/         # Feature-based modules
│   ├── auth/         # Authentication (Login, Register)
│   ├── properties/   # Properties management
│   ├── units/        # Rental units
│   ├── tenants/      # Tenants management
│   ├── contracts/    # Contracts management
│   ├── payments/     # Payments tracking
│   ├── maintenance/  # Maintenance requests
│   └── dashboard/    # Dashboard and analytics
└── shared/           # Shared components and utilities
    ├── api/          # API client and endpoints
    ├── components/   # Reusable UI components
    ├── types/        # TypeScript type definitions
    └── utils/        # Utility functions
```

### Mobile-First CSS Framework

PropFlow includes a custom mobile-first CSS framework with:

- **Responsive Grid System**: Mobile-first breakpoints (320px, 640px, 768px, 1024px, 1280px)
- **Touch-Friendly Components**: 44px minimum touch targets for iOS/Android
- **Design Tokens**: Consistent spacing, colors, typography, and shadows
- **Dark Mode Support**: Automatic dark mode detection and styling
- **Accessibility**: Focus indicators, screen reader support, keyboard navigation

### Key Mobile Features

- **Bottom Navigation**: Quick access to main features on mobile
- **Hamburger Menu**: Collapsible navigation for smaller screens  
- **Touch Gestures**: Swipe-friendly interfaces and large tap targets
- **Responsive Typography**: Scales appropriately across device sizes
- **Mobile-Optimized Forms**: Large inputs with proper keyboard types
- **Fast Loading**: Optimized bundle size and lazy loading

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
