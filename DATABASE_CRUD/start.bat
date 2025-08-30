@echo off
echo 🚀 Iniciando aplicación de tareas...

REM Verificar si Docker está ejecutándose
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker no está ejecutándose. Por favor, inicia Docker Desktop.
    pause
    exit /b 1
)

REM Construir e iniciar los contenedores
echo 📦 Construyendo e iniciando contenedores...
docker-compose up --build -d

REM Esperar a que MySQL esté listo
echo ⏳ Esperando a que MySQL esté listo...
timeout /t 10 /nobreak >nul

REM Verificar que los servicios estén ejecutándose
echo 🔍 Verificando servicios...
docker-compose ps

echo ✅ Aplicación iniciada correctamente!
echo.
echo 🌐 URLs de acceso:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001
echo    MySQL: localhost:3306
echo.
echo 📋 Comandos útiles:
echo    Ver logs: docker-compose logs -f
echo    Detener: docker-compose down
echo    Reiniciar: docker-compose restart
pause
