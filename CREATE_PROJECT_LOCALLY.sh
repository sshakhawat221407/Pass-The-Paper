#!/bin/bash
# Pass The Paper - Project Recreation Script
# Run this script on your local machine to recreate the project

echo "Creating Pass The Paper project..."
mkdir -p pass-the-paper
cd pass-the-paper

# Create package.json
cat > package.json << 'EOF'
{
  "name": "pass-the-paper",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.487.0",
    "sonner": "^2.0.3",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-slot": "^1.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.7.0",
    "@tailwindcss/vite": "^4.1.12",
    "tailwindcss": "^4.1.12",
    "vite": "^6.3.5",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.6.0"
  }
}
EOF

echo "✅ Created package.json"
echo ""
echo "📦 Next steps:"
echo "1. Copy all source files from the Figma Make project"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo ""
echo "Full source code needs to be copied from Figma Make workspace."

