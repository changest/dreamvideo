#!/bin/bash

# =============================================================================
# init.sh - DreamVideo Project Initialization Script
# =============================================================================
# Run this script to start the development server.
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}  DreamVideo - 文生视频工具${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Check if dependencies are installed
if [ ! -d "dreamvideo/node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    cd dreamvideo && npm install && cd ..
fi

# Start development server
echo -e "${YELLOW}Starting development server...${NC}"
cd dreamvideo
npm run dev &
SERVER_PID=$!
cd ..

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 3

echo ""
echo -e "${GREEN}✓ Initialization complete!${NC}"
echo -e "${GREEN}✓ Dev server running at http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}Project Structure:${NC}"
echo "  - Frontend: http://localhost:3000"
echo "  - Build: npm run build (in dreamvideo/)"
echo ""
echo "Ready to use!"
echo ""
echo "Features:"
echo "  • 文本生成视频"
echo "  • 支持多种 API (可灵、Runway、Pika...)"
echo "  • 魅族 Flyme 风格设计"
echo ""
