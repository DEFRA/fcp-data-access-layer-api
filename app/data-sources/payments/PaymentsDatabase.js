import Sequelize, { DataTypes } from 'sequelize'

export class PaymentsDatabase {
  async getConnection () {
    const serverUsername = process.env.PAYMENTS_DB_USERNAME
    const serverPassword = process.env.PAYMENTS_DB_PASSWORD
    const serverHost = process.env.PAYMENTS_DB_HOST
    const databaseName = process.env.PAYMENTS_DB_SCHEMA

    return new Sequelize(databaseName, serverUsername, serverPassword, {
      host: serverHost,
      dialect: 'mssql',
      dialectOptions: {
        options: {
          encrypt: false
        }
      }
    })
  }

  async getPaymentsBySBI (sbi) {
    const connection = await this.getConnection()

    const SbiToFrn = connection.define(
      'sbi_to_frn',
      {
        sbi: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        frn: DataTypes.STRING
      },
      { timestamps: false }
    )

    const Payments = connection.define(
      'payments',
      {
        firm_reference_number: DataTypes.STRING,
        bacs_ref: DataTypes.STRING,
        payment_date: DataTypes.DATE,
        agreement_claim_no: DataTypes.STRING,
        scheme: DataTypes.STRING,
        marketing_year: DataTypes.STRING,
        description: DataTypes.STRING,
        transaction_amount: DataTypes.FLOAT,
        transaction_currency: DataTypes.STRING
      },
      { timestamps: false }
    )

    const frn = await SbiToFrn.findOne({
      where: {
        sbi
      }
    })

    const payments = await Payments.findAll({
      where: {
        firm_reference_number: frn.frn
      }
    })

    return payments
  }

  async getPaymentsByApplicationId (applicationId) {
    const connection = await this.getConnection()

    const Payments = connection.define(
      'payments',
      {
        firm_reference_number: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        bacs_ref: DataTypes.STRING,
        payment_date: DataTypes.DATE,
        agreement_claim_no: DataTypes.STRING,
        scheme: DataTypes.STRING,
        marketing_year: DataTypes.STRING,
        description: DataTypes.STRING,
        transaction_amount: DataTypes.FLOAT,
        transaction_currency: DataTypes.STRING
      },
      { timestamps: false }
    )

    return Payments.findAll({
      where: {
        agreement_claim_no: `${applicationId}`
      }
    })
  }
}
