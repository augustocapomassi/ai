# 🔐 Librería Criptográfica

Una librería completa de criptografía en JavaScript que proporciona funciones seguras para hash, encriptación, firma digital y generación de claves.

## 🚀 Características

- **Hash seguro**: SHA-256, SHA-512, MD5
- **Hash con salt**: PBKDF2 para contraseñas
- **Encriptación simétrica**: AES-256-GCM
- **Encriptación asimétrica**: RSA 2048-bit
- **Firma digital**: RSA con verificación
- **Generación de claves**: Claves aleatorias y pares RSA
- **Tokens seguros**: Generación de tokens y UUIDs
- **Conversión de formatos**: Base64 y Buffer

## 📦 Instalación

```bash
cd Criptografia
npm install
```

## 🧪 Ejecutar tests

```bash
npm test
```

## 🎯 Ejecutar demo

```bash
npm start
```

## 📚 Uso básico

```javascript
const CriptografiaLib = require('./src/index');

const crypto = new CriptografiaLib();

// Generar claves
const clave = crypto.generarClave();
const { publicKey, privateKey } = crypto.generarClavesRSA();

// Hash
const hash = crypto.hashSHA256('mi texto');
const hashConSalt = crypto.hashConSalt('mi contraseña');

// Encriptación simétrica
const encriptado = crypto.encriptar('mensaje secreto', clave);
const desencriptado = crypto.desencriptar(encriptado.encriptado, clave, encriptado.iv, encriptado.tag);

// Encriptación RSA
const encriptadoRSA = crypto.encriptarRSA('mensaje', publicKey);
const desencriptadoRSA = crypto.desencriptarRSA(encriptadoRSA, privateKey);

// Firma digital
const firma = crypto.firmarRSA('documento', privateKey);
const esValida = crypto.verificarFirmaRSA('documento', firma, publicKey);

// Tokens
const token = crypto.generarToken();
const uuid = crypto.generarUUID();
```

## 🔧 API Reference

### Generación de claves
- `generarClave()`: Genera clave AES-256
- `generarIV()`: Genera vector de inicialización
- `generarClavesRSA(keySize)`: Genera par de claves RSA

### Funciones de hash
- `hashSHA256(texto)`: Hash SHA-256
- `hashSHA512(texto)`: Hash SHA-512
- `hashMD5(texto)`: Hash MD5 (no recomendado)
- `hashConSalt(password, salt, iterations)`: Hash PBKDF2
- `verificarPassword(password, hash, salt, iterations)`: Verifica contraseña

### Encriptación simétrica
- `encriptar(texto, clave)`: Encripta con AES-256-GCM
- `desencriptar(textoEncriptado, clave, iv, tag)`: Desencripta

### Encriptación asimétrica
- `encriptarRSA(texto, clavePublica)`: Encripta con RSA
- `desencriptarRSA(textoEncriptado, clavePrivada)`: Desencripta con RSA

### Firma digital
- `firmarRSA(texto, clavePrivada)`: Firma digital
- `verificarFirmaRSA(texto, firma, clavePublica)`: Verifica firma

### Utilidades
- `generarToken(longitud)`: Genera token aleatorio
- `generarUUID()`: Genera UUID v4
- `claveABase64(clave)`: Convierte clave a base64
- `base64AClave(claveBase64)`: Convierte base64 a clave

## 🛡️ Consideraciones de seguridad

- **SHA-256/512**: Recomendado para hash de datos
- **PBKDF2**: Recomendado para hash de contraseñas
- **AES-256-GCM**: Encriptación autenticada
- **RSA 2048-bit**: Mínimo recomendado para claves RSA
- **Salt aleatorio**: Siempre usar salt único para contraseñas
- **IV aleatorio**: Siempre usar IV único para encriptación

## ⚠️ Advertencias

- MD5 no es seguro para aplicaciones criptográficas
- Las claves deben almacenarse de forma segura
- Nunca compartir claves privadas
- Usar HTTPS en producción
- Implementar rotación de claves regularmente

## 📄 Licencia

MIT License

