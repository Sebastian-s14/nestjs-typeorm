module.exports = {
  type: 'mysql',
  // url: process.env.DATABASE_URL,
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'my_db',
  synchronize: true,
  logging: false,
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  entities: ['src/**/*.entity.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  ssl: {
    rejectUnauthorized: false,
  },
};
