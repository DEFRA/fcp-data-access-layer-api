import Sequelize, { DataTypes } from 'sequelize'

const databaseName = process.env.AUTHENTICATE_DB_SCHEMA
const serverHost = process.env.AUTHENTICATE_DB_HOST

const readUsername = process.env.AUTHENTICATE_DB_USERNAME
const readPassword = process.env.AUTHENTICATE_DB_PASSWORD
const sequelizeRead = new Sequelize(databaseName, readUsername, readPassword, {
  host: serverHost,
  dialect: 'mssql',
  dialectOptions: { options: { encrypt: false } },
  logging: false
})

const auditWriteUsername = process.env.AUTHENTICATE_DB_USERNAME_AUDIT_WRITE
const auditWritePassword = process.env.AUTHENTICATE_DB_PASSWORD_AUDIT_WRITE
const sequelizeWrite = new Sequelize(databaseName, auditWriteUsername, auditWritePassword, {
  host: serverHost,
  dialect: 'mssql',
  dialectOptions: { options: { encrypt: false } },
  logging: false
})

const Answer = sequelizeRead.define('Answers', {
  CRN: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  Date: DataTypes.STRING,
  Event: DataTypes.STRING,
  Location: DataTypes.STRING,
  UpdatedBy: DataTypes.STRING,
  Updated: DataTypes.DATE
})

const Audit = sequelizeWrite.define(
  'Audits',
  {
    Date: DataTypes.STRING,
    User: DataTypes.STRING,
    Action: DataTypes.STRING,
    CRN: DataTypes.BIGINT,
    Value: DataTypes.STRING,
    NewValue: DataTypes.STRING
  },
  {
    timestamps: false
  })

export class AuthenticateDatabase {
  async getAuthenticateQuestionsAnswersByCRN (crn, employeeId) {
    await Audit.create({
      Date: new Date().toISOString(),
      User: employeeId,
      Action: 'Search',
      Value: crn
    })

    return Answer.findOne({
      attributes: ['CRN', 'Date', 'Event', 'Location', 'Updated'],
      where: {
        CRN: crn
      }
    })
  }
}
