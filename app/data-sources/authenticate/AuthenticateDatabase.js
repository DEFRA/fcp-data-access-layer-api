import Sequelize, { DataTypes } from 'sequelize'

const databaseName = process.env.AUTHENTICATE_DB_SCHEMA
const serverUsername = process.env.AUTHENTICATE_DB_USERNAME
const serverPassword = process.env.AUTHENTICATE_DB_PASSWORD
const serverHost = process.env.AUTHENTICATE_DB_HOST

const sequelize = new Sequelize(databaseName, serverUsername, serverPassword, {
  host: serverHost,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false
    }
  }
})

const Answer = sequelize.define('Answers', {
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

const Audit = sequelize.define(
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
