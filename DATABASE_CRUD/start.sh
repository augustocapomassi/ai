#!/bin/bash

echo "🚀 Iniciando aplicación de tareas..."

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está ejecutándose. Por favor, inicia Docker Desktop."
    exit 1
fi

# Construir e iniciar los contenedores
echo "📦 Construyendo e iniciando contenedores..."
docker-compose up --build -d

# Esperar a que MySQL esté listo
echo "⏳ Esperando a que MySQL esté listo..."
sleep 10

# Verificar que los servicios estén ejecutándose
echo "🔍 Verificando servicios..."
docker-compose ps

echo "✅ Aplicación iniciada correctamente!"
echo ""
echo "🌐 URLs de acceso:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   MySQL: localhost:3306"
echo ""
echo "📋 Comandos útiles:"
echo "   Ver logs: docker-compose logs -f"
echo "   Detener: docker-compose down"
echo "   Reiniciar: docker-compose restart"
