#!/bin/bash
# Kill existing Next.js dev server and restart
pkill -f "next-server" 2>/dev/null || true
sleep 1
cd "$(dirname "$0")/app" && npm run dev
