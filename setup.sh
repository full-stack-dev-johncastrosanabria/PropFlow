#!/bin/bash

# PropFlow Setup Script
echo "🚀 Setting up PropFlow..."

# Check if .NET is installed
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET 10 SDK is required but not installed."
    echo "Please install from: https://dotnet.microsoft.com/download/dotnet/10.0"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install from: https://nodejs.org/"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is required but not installed."
    echo "Please install MySQL 8.0+ from: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup backend configuration
echo "📝 Setting up backend configuration..."
if [ ! -f "PropFlow.Api/appsettings.Development.json" ]; then
    cp PropFlow.Api/appsettings.Development.json.template PropFlow.Api/appsettings.Development.json
    echo "✅ Created PropFlow.Api/appsettings.Development.json from template"
    echo "⚠️  Please update the MySQL connection string in this file"
else
    echo "ℹ️  PropFlow.Api/appsettings.Development.json already exists"
fi

# Setup frontend configuration
echo "📝 Setting up frontend configuration..."
cd propflow-web
if [ ! -f ".env.local" ]; then
    cp .env.template .env.local
    echo "✅ Created propflow-web/.env.local from template"
else
    echo "ℹ️  propflow-web/.env.local already exists"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

cd ..

# Restore backend dependencies
echo "📦 Restoring backend dependencies..."
dotnet restore

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update PropFlow.Api/appsettings.Development.json with your MySQL credentials"
echo "2. Create the MySQL database: dotnet ef database update --project PropFlow.Infrastructure --startup-project PropFlow.Api"
echo "3. Start the backend: dotnet run --project PropFlow.Api --urls \"http://localhost:5050;https://localhost:5051\""
echo "4. Start the frontend: cd propflow-web && npm run dev"
echo ""
echo "📚 See README.md for detailed instructions and troubleshooting"