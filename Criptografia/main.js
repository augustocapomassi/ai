const CriptografiaLib = require('./src/index');

/**
 * Demo de la librería criptográfica
 * Muestra todas las funcionalidades disponibles
 */
function demoCriptografia() {
  console.log('🔐 DEMO DE LA LIBRERÍA CRIPTOGRÁFICA 🔐\n');
  
  const crypto = new CriptografiaLib();
  
  // 1. Generación de claves
  console.log('1️⃣ GENERACIÓN DE CLAVES');
  console.log('='.repeat(50));
  
  const claveSimetrica = crypto.generarClave();
  console.log('Clave simétrica generada:', crypto.claveABase64(claveSimetrica));
  
  const iv = crypto.generarIV();
  console.log('IV generado:', iv.toString('hex'));
  
  const { publicKey, privateKey } = crypto.generarClavesRSA();
  console.log('Clave pública RSA generada (primeros 50 caracteres):', publicKey.substring(0, 50) + '...');
  console.log('Clave privada RSA generada (primeros 50 caracteres):', privateKey.substring(0, 50) + '...');
  
  console.log('\n');
  
  // 2. Funciones de hash
  console.log('2️⃣ FUNCIONES DE HASH');
  console.log('='.repeat(50));
  
  const textoPrueba = 'Hola mundo criptográfico! 🚀';
  console.log('Texto original:', textoPrueba);
  
  const hashSHA256 = crypto.hashSHA256(textoPrueba);
  console.log('SHA-256:', hashSHA256);
  
  const hashSHA512 = crypto.hashSHA512(textoPrueba);
  console.log('SHA-512:', hashSHA512.substring(0, 64) + '...');
  
  const hashMD5 = crypto.hashMD5(textoPrueba);
  console.log('MD5:', hashMD5);
  
  console.log('\n');
  
  // 3. Hash con salt
  console.log('3️⃣ HASH CON SALT (PBKDF2)');
  console.log('='.repeat(50));
  
  const password = 'miPasswordSuperSecreto123!';
  console.log('Contraseña:', password);
  
  const hashConSalt = crypto.hashConSalt(password);
  console.log('Hash con salt:', hashConSalt.hash);
  console.log('Salt usado:', hashConSalt.salt);
  console.log('Iteraciones:', hashConSalt.iterations);
  
  const verificacion = crypto.verificarPassword(password, hashConSalt.hash, hashConSalt.salt, hashConSalt.iterations);
  console.log('Verificación de contraseña:', verificacion ? '✅ Correcta' : '❌ Incorrecta');
  
  const verificacionIncorrecta = crypto.verificarPassword('passwordIncorrecta', hashConSalt.hash, hashConSalt.salt, hashConSalt.iterations);
  console.log('Verificación con contraseña incorrecta:', verificacionIncorrecta ? '✅ Correcta' : '❌ Incorrecta');
  
  console.log('\n');
  
  // 4. Encriptación simétrica
  console.log('4️⃣ ENCRIPTACIÓN SIMÉTRICA (AES-256-GCM)');
  console.log('='.repeat(50));
  
  const mensajeSecreto = 'Este es un mensaje muy secreto que necesita ser protegido!';
  console.log('Mensaje original:', mensajeSecreto);
  
  const encriptacion = crypto.encriptar(mensajeSecreto, claveSimetrica);
  console.log('Mensaje encriptado:', encriptacion.encriptado);
  console.log('IV usado:', encriptacion.iv);
  console.log('Tag de autenticación:', encriptacion.tag);
  
  const desencriptacion = crypto.desencriptar(
    encriptacion.encriptado,
    claveSimetrica,
    encriptacion.iv,
    encriptacion.tag
  );
  console.log('Mensaje desencriptado:', desencriptacion);
  console.log('¿Coincide con el original?', mensajeSecreto === desencriptacion ? '✅ Sí' : '❌ No');
  
  console.log('\n');
  
  // 5. Encriptación RSA
  console.log('5️⃣ ENCRIPTACIÓN ASIMÉTRICA (RSA)');
  console.log('='.repeat(50));
  
  const mensajeRSA = 'Mensaje para encriptar con RSA';
  console.log('Mensaje original:', mensajeRSA);
  
  const encriptadoRSA = crypto.encriptarRSA(mensajeRSA, publicKey);
  console.log('Mensaje encriptado con RSA:', encriptadoRSA);
  
  const desencriptadoRSA = crypto.desencriptarRSA(encriptadoRSA, privateKey);
  console.log('Mensaje desencriptado con RSA:', desencriptadoRSA);
  console.log('¿Coincide con el original?', mensajeRSA === desencriptadoRSA ? '✅ Sí' : '❌ No');
  
  console.log('\n');
  
  // 6. Firma digital
  console.log('6️⃣ FIRMA DIGITAL (RSA)');
  console.log('='.repeat(50));
  
  const documento = 'Este es un documento importante que necesita ser firmado digitalmente.';
  console.log('Documento original:', documento);
  
  const firma = crypto.firmarRSA(documento, privateKey);
  console.log('Firma digital:', firma);
  
  const verificacionFirma = crypto.verificarFirmaRSA(documento, firma, publicKey);
  console.log('Verificación de firma:', verificacionFirma ? '✅ Válida' : '❌ Inválida');
  
  const documentoModificado = documento + ' (MODIFICADO)';
  const verificacionFirmaModificada = crypto.verificarFirmaRSA(documentoModificado, firma, publicKey);
  console.log('Verificación de firma en documento modificado:', verificacionFirmaModificada ? '✅ Válida' : '❌ Inválida');
  
  console.log('\n');
  
  // 7. Generación de tokens y UUIDs
  console.log('7️⃣ GENERACIÓN DE TOKENS Y UUIDs');
  console.log('='.repeat(50));
  
  const token = crypto.generarToken();
  console.log('Token aleatorio (32 bytes):', token);
  
  const tokenCorto = crypto.generarToken(16);
  console.log('Token corto (16 bytes):', tokenCorto);
  
  const uuid = crypto.generarUUID();
  console.log('UUID v4:', uuid);
  
  console.log('\n');
  
  // 8. Casos de uso prácticos
  console.log('8️⃣ CASOS DE USO PRÁCTICOS');
  console.log('='.repeat(50));
  
  // Simulación de registro de usuario
  console.log('📝 Simulación de registro de usuario:');
  const usuario = 'usuario@ejemplo.com';
  const passwordUsuario = 'password123';
  
  const hashUsuario = crypto.hashConSalt(passwordUsuario);
  console.log(`Usuario: ${usuario}`);
  console.log(`Hash de contraseña almacenado: ${hashUsuario.hash}`);
  console.log(`Salt almacenado: ${hashUsuario.salt}`);
  
  // Simulación de login
  console.log('\n🔑 Simulación de login:');
  const passwordIngresada = 'password123';
  const loginExitoso = crypto.verificarPassword(passwordIngresada, hashUsuario.hash, hashUsuario.salt, hashUsuario.iterations);
  console.log(`Contraseña ingresada: ${passwordIngresada}`);
  console.log(`Login: ${loginExitoso ? '✅ Exitoso' : '❌ Fallido'}`);
  
  // Simulación de comunicación segura
  console.log('\n💬 Simulación de comunicación segura:');
  const mensajeChat = 'Hola, ¿cómo estás?';
  const claveChat = crypto.generarClave();
  
  const mensajeEncriptado = crypto.encriptar(mensajeChat, claveChat);
  console.log(`Mensaje original: ${mensajeChat}`);
  console.log(`Mensaje encriptado: ${mensajeEncriptado.encriptado}`);
  
  const mensajeDesencriptado = crypto.desencriptar(
    mensajeEncriptado.encriptado,
    claveChat,
    mensajeEncriptado.iv,
    mensajeEncriptado.tag
  );
  console.log(`Mensaje desencriptado: ${mensajeDesencriptado}`);
  
  console.log('\n');
  
  // 9. Resumen de seguridad
  console.log('9️⃣ RESUMEN DE SEGURIDAD');
  console.log('='.repeat(50));
  console.log('✅ Hash SHA-256/512: Resistente a colisiones');
  console.log('✅ PBKDF2: Resistente a ataques de fuerza bruta');
  console.log('✅ AES-256-GCM: Encriptación autenticada');
  console.log('✅ RSA 2048-bit: Criptografía asimétrica segura');
  console.log('✅ Firma digital: Integridad y autenticidad');
  console.log('✅ Tokens aleatorios: Generación criptográficamente segura');
  console.log('✅ UUIDs: Identificadores únicos globales');
  
  console.log('\n🎉 ¡Demo completado exitosamente! 🎉');
}

// Ejecutar el demo
if (require.main === module) {
  try {
    demoCriptografia();
  } catch (error) {
    console.error('❌ Error durante la ejecución del demo:', error.message);
    process.exit(1);
  }
}

module.exports = { demoCriptografia };
