import Sequelize from 'sequelize'

const serverUsername = process.env.AUTHENTICATE_DB_USERNAME
const serverPassword = process.env.AUTHENTICATE_DB_PASSWORD
const serverHost = process.env.AUTHENTICATE_DB_HOST
const databaseName = process.env.AUTHENTICATE_DB_TABLE

console.log(databaseName, serverUsername, serverPassword)

const sequelizeMSSQL = new Sequelize(databaseName, serverUsername, serverPassword, {
  host: serverHost,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false
    }
  }
})
const [results] = await sequelizeMSSQL.query('SELECT * FROM INFORMATION_SCHEMA.TABLES;')

console.log(results)
