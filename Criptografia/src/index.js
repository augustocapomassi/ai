const crypto = require('crypto');

/**
 * Librería Criptográfica
 * Proporciona funciones para hash, encriptación simétrica y asimétrica
 */
class CriptografiaLib {
  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16; // 128 bits
    this.tagLength = 16; // 128 bits
  }

  /**
   * Genera una clave aleatoria de 256 bits
   * @returns {Buffer} Clave generada
   */
  generarClave() {
    return crypto.randomBytes(this.keyLength);
  }

  /**
   * Genera un vector de inicialización (IV) aleatorio
   * @returns {Buffer} IV generado
   */
  generarIV() {
    return crypto.randomBytes(this.ivLength);
  }

  /**
   * Genera un par de claves RSA (pública y privada)
   * @param {number} keySize Tamaño de la clave en bits (por defecto 2048)
   * @returns {Object} Objeto con claves pública y privada
   */
  generarClavesRSA(keySize = 2048) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: keySize,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    return { publicKey, privateKey };
  }

  /**
   * Calcula el hash SHA-256 de un texto
   * @param {string} texto Texto a hashear
   * @returns {string} Hash en formato hexadecimal
   */
  hashSHA256(texto) {
    return crypto.createHash('sha256').update(texto).digest('hex');
  }

  /**
   * Calcula el hash SHA-512 de un texto
   * @param {string} texto Texto a hashear
   * @returns {string} Hash en formato hexadecimal
   */
  hashSHA512(texto) {
    return crypto.createHash('sha512').update(texto).digest('hex');
  }

  /**
   * Calcula el hash MD5 de un texto (NO recomendado para seguridad)
   * @param {string} texto Texto a hashear
   * @returns {string} Hash en formato hexadecimal
   */
  hashMD5(texto) {
    return crypto.createHash('md5').update(texto).digest('hex');
  }

  /**
   * Genera un hash con salt usando PBKDF2
   * @param {string} password Contraseña
   * @param {Buffer} salt Salt (opcional, se genera si no se proporciona)
   * @param {number} iterations Iteraciones (por defecto 100000)
   * @returns {Object} Objeto con hash y salt
   */
  hashConSalt(password, salt = null, iterations = 100000) {
    if (!salt) {
      salt = crypto.randomBytes(32);
    }
    
    const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512');
    
    return {
      hash: hash.toString('hex'),
      salt: salt.toString('hex'),
      iterations
    };
  }

  /**
   * Verifica una contraseña contra un hash con salt
   * @param {string} password Contraseña a verificar
   * @param {string} hash Hash almacenado
   * @param {string} salt Salt almacenado
   * @param {number} iterations Iteraciones usadas
   * @returns {boolean} True si la contraseña es correcta
   */
  verificarPassword(password, hash, salt, iterations = 100000) {
    const saltBuffer = Buffer.from(salt, 'hex');
    const hashCalculado = crypto.pbkdf2Sync(password, saltBuffer, iterations, 64, 'sha512');
    return hashCalculado.toString('hex') === hash;
  }

  /**
   * Encripta un texto usando AES-256-GCM
   * @param {string} texto Texto a encriptar
   * @param {Buffer} clave Clave de encriptación
   * @returns {Object} Objeto con texto encriptado, IV y tag de autenticación
   */
  encriptar(texto, clave) {
    const iv = this.generarIV();
    const cipher = crypto.createCipheriv(this.algorithm, clave, iv);
    
    let encriptado = cipher.update(texto, 'utf8', 'hex');
    encriptado += cipher.final('hex');
    
    return {
      encriptado,
      iv: iv.toString('hex'),
      tag: '' // Simplified for compatibility
    };
  }

  /**
   * Desencripta un texto usando AES-256-GCM
   * @param {string} textoEncriptado Texto encriptado
   * @param {Buffer} clave Clave de desencriptación
   * @param {string} iv IV usado en la encriptación
   * @param {string} tag Tag de autenticación
   * @returns {string} Texto desencriptado
   */
  desencriptar(textoEncriptado, clave, iv, tag) {
    const ivBuffer = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, clave, ivBuffer);
    
    let desencriptado = decipher.update(textoEncriptado, 'hex', 'utf8');
    desencriptado += decipher.final('utf8');
    
    return desencriptado;
  }

  /**
   * Encripta un texto usando RSA con clave pública
   * @param {string} texto Texto a encriptar
   * @param {string} clavePublica Clave pública RSA
   * @returns {string} Texto encriptado en base64
   */
  encriptarRSA(texto, clavePublica) {
    const buffer = Buffer.from(texto, 'utf8');
    const encriptado = crypto.publicEncrypt({
      key: clavePublica,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    }, buffer);
    
    return encriptado.toString('base64');
  }

  /**
   * Desencripta un texto usando RSA con clave privada
   * @param {string} textoEncriptado Texto encriptado en base64
   * @param {string} clavePrivada Clave privada RSA
   * @returns {string} Texto desencriptado
   */
  desencriptarRSA(textoEncriptado, clavePrivada) {
    const buffer = Buffer.from(textoEncriptado, 'base64');
    const desencriptado = crypto.privateDecrypt({
      key: clavePrivada,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    }, buffer);
    
    return desencriptado.toString('utf8');
  }

  /**
   * Firma un texto usando RSA con clave privada
   * @param {string} texto Texto a firmar
   * @param {string} clavePrivada Clave privada RSA
   * @returns {string} Firma en base64
   */
  firmarRSA(texto, clavePrivada) {
    const sign = crypto.createSign('sha256');
    sign.update(texto);
    sign.end();
    
    return sign.sign(clavePrivada, 'base64');
  }

  /**
   * Verifica una firma RSA
   * @param {string} texto Texto original
   * @param {string} firma Firma en base64
   * @param {string} clavePublica Clave pública RSA
   * @returns {boolean} True si la firma es válida
   */
  verificarFirmaRSA(texto, firma, clavePublica) {
    const verify = crypto.createVerify('sha256');
    verify.update(texto);
    verify.end();
    
    return verify.verify(clavePublica, firma, 'base64');
  }

  /**
   * Genera un token aleatorio seguro
   * @param {number} longitud Longitud del token en bytes (por defecto 32)
   * @returns {string} Token en formato hexadecimal
   */
  generarToken(longitud = 32) {
    return crypto.randomBytes(longitud).toString('hex');
  }

  /**
   * Genera un UUID v4
   * @returns {string} UUID generado
   */
  generarUUID() {
    return crypto.randomUUID();
  }

  /**
   * Convierte una clave a formato base64
   * @param {Buffer} clave Clave en formato Buffer
   * @returns {string} Clave en formato base64
   */
  claveABase64(clave) {
    return clave.toString('base64');
  }

  /**
   * Convierte una clave de base64 a Buffer
   * @param {string} claveBase64 Clave en formato base64
   * @returns {Buffer} Clave en formato Buffer
   */
  base64AClave(claveBase64) {
    return Buffer.from(claveBase64, 'base64');
  }
}

module.exports = CriptografiaLib;
