const CriptografiaLib = require('./src/index');

console.log('🔐 Probando librería criptográfica...\n');

try {
  const crypto = new CriptografiaLib();
  
  // Test básico de hash
  const hash = crypto.hashSHA256('Hola mundo');
  console.log('✅ Hash SHA-256:', hash);
  
  // Test de generación de clave
  const clave = crypto.generarClave();
  console.log('✅ Clave generada:', crypto.claveABase64(clave));
  
  // Test de encriptación simétrica
  const mensaje = 'Mensaje secreto';
  const encriptado = crypto.encriptar(mensaje, clave);
  console.log('✅ Mensaje encriptado:', encriptado.encriptado);
  
  const desencriptado = crypto.desencriptar(
    encriptado.encriptado,
    clave,
    encriptado.iv,
    encriptado.tag
  );
  console.log('✅ Mensaje desencriptado:', desencriptado);
  console.log('✅ ¿Coincide?', mensaje === desencriptado ? 'Sí' : 'No');
  
  // Test de generación de claves RSA
  const { publicKey, privateKey } = crypto.generarClavesRSA();
  console.log('✅ Claves RSA generadas correctamente');
  
  // Test de encriptación RSA
  const mensajeRSA = 'Mensaje para RSA';
  const encriptadoRSA = crypto.encriptarRSA(mensajeRSA, publicKey);
  const desencriptadoRSA = crypto.desencriptarRSA(encriptadoRSA, privateKey);
  console.log('✅ RSA - ¿Coincide?', mensajeRSA === desencriptadoRSA ? 'Sí' : 'No');
  
  // Test de firma digital
  const documento = 'Documento importante';
  const firma = crypto.firmarRSA(documento, privateKey);
  const esValida = crypto.verificarFirmaRSA(documento, firma, publicKey);
  console.log('✅ Firma digital válida:', esValida ? 'Sí' : 'No');
  
  // Test de hash con salt
  const password = 'miPassword123';
  const hashConSalt = crypto.hashConSalt(password);
  const verificacion = crypto.verificarPassword(password, hashConSalt.hash, hashConSalt.salt, hashConSalt.iterations);
  console.log('✅ Hash con salt - ¿Verificación correcta?', verificacion ? 'Sí' : 'No');
  
  // Test de tokens
  const token = crypto.generarToken();
  const uuid = crypto.generarUUID();
  console.log('✅ Token generado:', token);
  console.log('✅ UUID generado:', uuid);
  
  console.log('\n🎉 ¡Todos los tests básicos pasaron exitosamente!');
  
} catch (error) {
  console.error('❌ Error durante las pruebas:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
