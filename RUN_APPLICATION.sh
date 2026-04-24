#!/bin/bash

# PropFlow - Application Startup Script
# This script starts both the backend API and frontend development server

echo "🚀 PropFlow - Starting Application"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi

# Check if .NET is installed
if ! command -v dotnet &> /dev/null; then
    echo -e "${YELLOW}⚠️  .NET SDK is not installed. Please install .NET 10 SDK${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites verified${NC}"
echo ""

# Start Backend API
echo -e "${BLUE}Starting Backend API...${NC}"
cd PropFlow.Api
dotnet run &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend API started (PID: $BACKEND_PID)${NC}"
echo "  URL: http://localhost:5050"
echo ""

# Wait for backend to start
sleep 3

# Start Frontend
echo -e "${BLUE}Starting Frontend...${NC}"
cd ../propflow-web
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "  URL: http://localhost:5174"
echo ""

echo -e "${GREEN}=================================="
echo "✓ Application is running!"
echo "=================================${NC}"
echo ""
echo "📱 Frontend: http://localhost:5174"
echo "🔌 Backend:  http://localhost:5050"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
