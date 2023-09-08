import * as sql from 'mssql';

// Configuration for your MSSQL database
const dbConfig: sql.config = {
  user: 'root',
  password: 'password',
  server: 'dopyourdopdb.cgj0ywhm1m7p.af-south-1.rds.amazonaws.com',
  database: 'DopYourDop',
  port: 1433,
  options: {
    encrypt: true, // For secure connections
    trustServerCertificate: true, // Disable certificate validation (not recommended for production)
  },
};

class DatabaseService {
  private pool: sql.ConnectionPool;

  constructor() {
    this.pool = new sql.ConnectionPool(dbConfig);
  }

  async connect() {
    try {
      await this.pool.connect();
      console.log('Connected to the database');
    } catch (err) {
      console.error('Database connection error:', err);
    }
  }

  async disconnect() {
    try {
      await this.pool.close();
      console.log('Disconnected from the database');
    } catch (err) {
      console.error('Database disconnection error:', err);
    }
  }

  async login(data:{username:string , password:string}):Promise<any> {
    try {
        const pool = await sql.connect(dbConfig);
        
        const query = `SELECT username FROM users where username = '${data.username}' or email = '${data.username}' and password = '${data.password}'`;  // You can customize this query as needed
        const result = await pool.request().query(query);

        await pool.close();
        return result.recordset
      } catch (error) {
        return {error:error}
      }
  }
  async register(data:{username:string , password:string, email:string}):Promise<any> {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('Connected to the database');
        
        const query = `INSERT INTO users (username, email, password) VALUES ('${data.username}', '${data.email}', '${data.password}');`; // You can customize this query as needed
        const result = await pool.request().query(query);
        await pool.close();

        return result
      } catch (error) {
        return {error:error};
      }
  }
}

export default DatabaseService;
