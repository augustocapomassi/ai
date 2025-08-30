const CriptografiaLib = require('../index');

describe('CriptografiaLib', () => {
  let cryptoLib;

  beforeEach(() => {
    cryptoLib = new CriptografiaLib();
  });

  describe('Generación de claves', () => {
    test('debería generar una clave de 256 bits', () => {
      const clave = cryptoLib.generarClave();
      expect(clave).toBeInstanceOf(Buffer);
      expect(clave.length).toBe(32); // 256 bits = 32 bytes
    });

    test('debería generar un IV de 128 bits', () => {
      const iv = cryptoLib.generarIV();
      expect(iv).toBeInstanceOf(Buffer);
      expect(iv.length).toBe(16); // 128 bits = 16 bytes
    });

    test('debería generar claves RSA', () => {
      const { publicKey, privateKey } = cryptoLib.generarClavesRSA();
      
      expect(publicKey).toContain('-----BEGIN PUBLIC KEY-----');
      expect(publicKey).toContain('-----END PUBLIC KEY-----');
      expect(privateKey).toContain('-----BEGIN PRIVATE KEY-----');
      expect(privateKey).toContain('-----END PRIVATE KEY-----');
    });

    test('debería generar claves RSA con tamaño personalizado', () => {
      const { publicKey, privateKey } = cryptoLib.generarClavesRSA(1024);
      
      expect(publicKey).toBeDefined();
      expect(privateKey).toBeDefined();
    });
  });

  describe('Funciones de hash', () => {
    const textoPrueba = 'Hola mundo criptográfico';

    test('debería calcular hash SHA-256', () => {
      const hash = cryptoLib.hashSHA256(textoPrueba);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64); // SHA-256 produce 64 caracteres hex
      expect(hash).toMatch(/^[a-f0-9]+$/i);
    });

    test('debería calcular hash SHA-512', () => {
      const hash = cryptoLib.hashSHA512(textoPrueba);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(128); // SHA-512 produce 128 caracteres hex
      expect(hash).toMatch(/^[a-f0-9]+$/i);
    });

    test('debería calcular hash MD5', () => {
      const hash = cryptoLib.hashMD5(textoPrueba);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(32); // MD5 produce 32 caracteres hex
      expect(hash).toMatch(/^[a-f0-9]+$/i);
    });

    test('debería generar el mismo hash para el mismo texto', () => {
      const hash1 = cryptoLib.hashSHA256(textoPrueba);
      const hash2 = cryptoLib.hashSHA256(textoPrueba);
      
      expect(hash1).toBe(hash2);
    });

    test('debería generar hashes diferentes para textos diferentes', () => {
      const hash1 = cryptoLib.hashSHA256('texto1');
      const hash2 = cryptoLib.hashSHA256('texto2');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Hash con salt', () => {
    const password = 'miPassword123';

    test('debería generar hash con salt', () => {
      const resultado = cryptoLib.hashConSalt(password);
      
      expect(resultado).toHaveProperty('hash');
      expect(resultado).toHaveProperty('salt');
      expect(resultado).toHaveProperty('iterations');
      expect(resultado.iterations).toBe(100000);
      expect(typeof resultado.hash).toBe('string');
      expect(typeof resultado.salt).toBe('string');
    });

    test('debería generar salt diferente cada vez', () => {
      const resultado1 = cryptoLib.hashConSalt(password);
      const resultado2 = cryptoLib.hashConSalt(password);
      
      expect(resultado1.salt).not.toBe(resultado2.salt);
      expect(resultado1.hash).not.toBe(resultado2.hash);
    });

    test('debería verificar password correctamente', () => {
      const resultado = cryptoLib.hashConSalt(password);
      const esValida = cryptoLib.verificarPassword(
        password, 
        resultado.hash, 
        resultado.salt, 
        resultado.iterations
      );
      
      expect(esValida).toBe(true);
    });

    test('debería rechazar password incorrecta', () => {
      const resultado = cryptoLib.hashConSalt(password);
      const esValida = cryptoLib.verificarPassword(
        'passwordIncorrecta', 
        resultado.hash, 
        resultado.salt, 
        resultado.iterations
      );
      
      expect(esValida).toBe(false);
    });

    test('debería usar salt personalizado', () => {
      const saltPersonalizado = cryptoLib.generarClave();
      const resultado = cryptoLib.hashConSalt(password, saltPersonalizado);
      
      expect(resultado.salt).toBe(saltPersonalizado.toString('hex'));
    });
  });

  describe('Encriptación simétrica', () => {
    const textoPrueba = 'Este es un texto secreto para encriptar';
    let clave;

    beforeEach(() => {
      clave = cryptoLib.generarClave();
    });

    test('debería encriptar y desencriptar texto', () => {
      const resultado = cryptoLib.encriptar(textoPrueba, clave);
      
      expect(resultado).toHaveProperty('encriptado');
      expect(resultado).toHaveProperty('iv');
      expect(resultado).toHaveProperty('tag');
      
      const desencriptado = cryptoLib.desencriptar(
        resultado.encriptado,
        clave,
        resultado.iv,
        resultado.tag
      );
      
      expect(desencriptado).toBe(textoPrueba);
    });

    test('debería generar resultados diferentes para la misma entrada', () => {
      const resultado1 = cryptoLib.encriptar(textoPrueba, clave);
      const resultado2 = cryptoLib.encriptar(textoPrueba, clave);
      
      expect(resultado1.encriptado).not.toBe(resultado2.encriptado);
      expect(resultado1.iv).not.toBe(resultado2.iv);
    });

    test('debería fallar con clave incorrecta', () => {
      const resultado = cryptoLib.encriptar(textoPrueba, clave);
      const claveIncorrecta = cryptoLib.generarClave();
      
      expect(() => {
        cryptoLib.desencriptar(
          resultado.encriptado,
          claveIncorrecta,
          resultado.iv,
          resultado.tag
        );
      }).toThrow();
    });
  });

  describe('Encriptación RSA', () => {
    const textoPrueba = 'Texto para encriptar con RSA';
    let clavesRSA;

    beforeEach(() => {
      clavesRSA = cryptoLib.generarClavesRSA();
    });

    test('debería encriptar y desencriptar con RSA', () => {
      const encriptado = cryptoLib.encriptarRSA(textoPrueba, clavesRSA.publicKey);
      
      expect(encriptado).toBeDefined();
      expect(typeof encriptado).toBe('string');
      
      const desencriptado = cryptoLib.desencriptarRSA(encriptado, clavesRSA.privateKey);
      
      expect(desencriptado).toBe(textoPrueba);
    });

    test('debería generar resultados diferentes para la misma entrada', () => {
      const encriptado1 = cryptoLib.encriptarRSA(textoPrueba, clavesRSA.publicKey);
      const encriptado2 = cryptoLib.encriptarRSA(textoPrueba, clavesRSA.publicKey);
      
      expect(encriptado1).not.toBe(encriptado2);
    });
  });

  describe('Firma digital RSA', () => {
    const textoPrueba = 'Texto para firmar digitalmente';
    let clavesRSA;

    beforeEach(() => {
      clavesRSA = cryptoLib.generarClavesRSA();
    });

    test('debería firmar y verificar texto', () => {
      const firma = cryptoLib.firmarRSA(textoPrueba, clavesRSA.privateKey);
      
      expect(firma).toBeDefined();
      expect(typeof firma).toBe('string');
      
      const esValida = cryptoLib.verificarFirmaRSA(textoPrueba, firma, clavesRSA.publicKey);
      
      expect(esValida).toBe(true);
    });

    test('debería rechazar firma de texto modificado', () => {
      const firma = cryptoLib.firmarRSA(textoPrueba, clavesRSA.privateKey);
      const textoModificado = textoPrueba + ' modificado';
      
      const esValida = cryptoLib.verificarFirmaRSA(textoModificado, firma, clavesRSA.publicKey);
      
      expect(esValida).toBe(false);
    });

    test('debería rechazar firma incorrecta', () => {
      const firma = cryptoLib.firmarRSA(textoPrueba, clavesRSA.privateKey);
      const firmaIncorrecta = firma.slice(0, -10) + '1234567890';
      
      const esValida = cryptoLib.verificarFirmaRSA(textoPrueba, firmaIncorrecta, clavesRSA.publicKey);
      
      expect(esValida).toBe(false);
    });
  });

  describe('Generación de tokens y UUIDs', () => {
    test('debería generar token aleatorio', () => {
      const token = cryptoLib.generarToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // 32 bytes * 2 (hex)
    });

    test('debería generar token con longitud personalizada', () => {
      const token = cryptoLib.generarToken(16);
      
      expect(token).toBeDefined();
      expect(token.length).toBe(32); // 16 bytes * 2 (hex)
    });

    test('debería generar tokens diferentes', () => {
      const token1 = cryptoLib.generarToken();
      const token2 = cryptoLib.generarToken();
      
      expect(token1).not.toBe(token2);
    });

    test('debería generar UUID v4', () => {
      const uuid = cryptoLib.generarUUID();
      
      expect(uuid).toBeDefined();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    test('debería generar UUIDs diferentes', () => {
      const uuid1 = cryptoLib.generarUUID();
      const uuid2 = cryptoLib.generarUUID();
      
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('Conversión de formatos', () => {
    test('debería convertir clave a base64 y viceversa', () => {
      const claveOriginal = cryptoLib.generarClave();
      const claveBase64 = cryptoLib.claveABase64(claveOriginal);
      const claveRestaurada = cryptoLib.base64AClave(claveBase64);
      
      expect(claveBase64).toBeDefined();
      expect(typeof claveBase64).toBe('string');
      expect(claveRestaurada).toEqual(claveOriginal);
    });
  });

  describe('Casos edge', () => {
    test('debería manejar texto vacío', () => {
      const hash = cryptoLib.hashSHA256('');
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });

    test('debería manejar texto muy largo', () => {
      const textoLargo = 'a'.repeat(10000);
      const hash = cryptoLib.hashSHA256(textoLargo);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });

    test('debería manejar caracteres especiales', () => {
      const textoEspecial = '¡Hola! ¿Cómo estás? 中文 🚀';
      const hash = cryptoLib.hashSHA256(textoEspecial);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });
  });
});
