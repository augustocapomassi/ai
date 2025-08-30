#!/bin/bash

echo "🔐 Instalando dependencias de la librería criptográfica..."
npm install

echo ""
echo "🧪 Ejecutando tests..."
npm test

echo ""
echo "🎯 Ejecutando demo..."
npm start

