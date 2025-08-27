# CSV Processor - Large File Data Generation and Aggregation

Este proyecto implementa un sistema completo para generar archivos CSV grandes con datos aleatorios de ventas y procesarlos para crear agregaciones mensuales. Está diseñado para manejar archivos que no caben en memoria.

## 🚀 Características

- **Generación de datos**: Crea archivos CSV con 1,000,000 de registros de ventas aleatorias
- **Procesamiento eficiente**: Utiliza streams para procesar archivos grandes sin cargarlos en memoria
- **Agregaciones estadísticas**: Calcula métricas por año y mes:
  - Número de ventas
  - Valor máximo
  - Valor mínimo
  - Media
  - Desviación estándar
- **Tests completos**: Cobertura de tests para todas las funcionalidades
- **TypeScript**: Código completamente tipado

## 📊 Estructura de Datos

### Archivo de entrada generado (`sales_data.csv`)
```csv
id,order_id,customer_id,total,fecha
1,100,25,50.00,2020-01-15
2,101,30,75.50,2020-01-20
...
```

### Archivo de salida (`monthly_aggregations.csv`)
```csv
year,month,sales_count,max_total,min_total,avg_total,std_dev_total
2020,1,150,9999.99,10.00,1250.45,850.23
2020,2,142,8750.50,15.25,1180.30,720.15
...
```

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd csv-processor
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Compilar TypeScript**
```bash
npm run build
```

## 📋 Uso

### Opción 1: Pipeline completo
Ejecuta la generación de datos y el procesamiento en una sola operación:
```bash
npm run dev
# o
npm start
```

### Opción 2: Generar solo los datos
```bash
npm run generate
```

### Opción 3: Procesar datos existentes
```bash
npm run process
```

### Opción 4: Ejecutar tests
```bash
npm test
```

## 🔧 Configuración

Puedes modificar la configuración en `src/generateData.ts`:

```typescript
const config: DataGeneratorConfig = {
  recordCount: 1000000,        // Número de registros a generar
  outputFile: './data/sales_data.csv',
  startDate: new Date('2020-01-01'),  // Fecha de inicio
  endDate: new Date('2024-12-31'),    // Fecha de fin
  minTotal: 10.0,              // Valor mínimo de venta
  maxTotal: 10000.0,           // Valor máximo de venta
  maxCustomerId: 50000,        // ID máximo de cliente
  maxOrderId: 2000000          // ID máximo de orden
};
```

## 📁 Estructura del Proyecto

```
csv-processor/
├── src/
│   ├── __tests__/           # Tests unitarios
│   ├── types.ts             # Definiciones de tipos
│   ├── utils.ts             # Funciones utilitarias
│   ├── dataGenerator.ts     # Generador de datos CSV
│   ├── dataProcessor.ts     # Procesador y agregador
│   ├── generateData.ts      # Script de generación
│   ├── processData.ts       # Script de procesamiento
│   └── index.ts             # Punto de entrada principal
├── data/                    # Archivos de datos generados
├── dist/                    # Código compilado
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🧪 Tests

El proyecto incluye tests completos para todas las funcionalidades:

- **Utils**: Funciones de generación aleatoria y cálculos matemáticos
- **DataGenerator**: Generación de archivos CSV grandes
- **DataProcessor**: Procesamiento y agregación de datos

Ejecutar tests:
```bash
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch para desarrollo
```

## ⚡ Rendimiento

- **Generación**: ~10,000 registros por segundo
- **Procesamiento**: Utiliza streams para manejar archivos de cualquier tamaño
- **Memoria**: Consumo constante independientemente del tamaño del archivo

## 🔍 Ejemplo de Uso

```typescript
import { DataGenerator, DataGeneratorConfig } from './src/dataGenerator';
import { DataProcessor } from './src/dataProcessor';

// 1. Generar datos
const config: DataGeneratorConfig = {
  recordCount: 1000000,
  outputFile: './data/sales_data.csv',
  startDate: new Date('2020-01-01'),
  endDate: new Date('2024-12-31'),
  minTotal: 10.0,
  maxTotal: 10000.0,
  maxCustomerId: 50000,
  maxOrderId: 2000000
};

const generator = new DataGenerator(config);
await generator.generateCSV();

// 2. Procesar y agregar datos
const processor = new DataProcessor(
  './data/sales_data.csv',
  './data/monthly_aggregations.csv'
);
await processor.processData();
```

## 🚨 Consideraciones

- **Espacio en disco**: El archivo generado ocupará aproximadamente 50-100 MB
- **Tiempo de generación**: Dependiendo del hardware, puede tomar 1-5 minutos
- **Memoria**: El procesamiento utiliza streams para minimizar el uso de memoria

## 📝 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o problemas, por favor abre un issue en el repositorio.
