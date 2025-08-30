const mysql = require('mysql2/promise');
const config = require('../config');

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(config.database);
      console.log('Conectado a la base de datos MySQL');
      await this.createTables();
    } catch (error) {
      console.error('Error conectando a la base de datos:', error);
      throw error;
    }
  }

  async createTables() {
    const createTasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    try {
      await this.connection.execute(createTasksTable);
      console.log('Tabla de tareas creada/verificada correctamente');
    } catch (error) {
      console.error('Error creando tabla:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('Desconectado de la base de datos');
    }
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = new Database();
