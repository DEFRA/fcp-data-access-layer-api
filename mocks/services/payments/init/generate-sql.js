import { faker } from '@faker-js/faker/locale/en_GB'
import fs from 'fs'
import files from 'mocks/utils/files.js'

const { getJSON } = files(import.meta.url)

const getDirectories = source =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const orgIds = await getDirectories('./mocks/fixtures/orgId')

const sbiToFrns = {}
const payments = []

for (const orgId of orgIds) {
  const applications = getJSON(`../../../fixtures/orgId/${orgId}/organisation-applications.json`).applications
  const organisation = getJSON(`../../../fixtures/orgId/${orgId}/organisation.json`)._data

  const frn = faker.string.uuid()
  sbiToFrns[organisation.sbi] = frn

  for (const application of applications) {
    payments.push({
      firm_reference_number: frn,
      bacs_ref: faker.finance.iban(),
      payment_date: application.application_movement_date,
      agreement_claim_no: application.application_id,
      scheme: faker.helpers.arrayElement(['BPS', 'CS', 'ES', 'RDPE']),
      marketing_year: faker.helpers.arrayElement(['2020', '2021', '2022', '2023']),
      description: faker.lorem.paragraph(),
      transaction_amount: faker.finance.amount(),
      transaction_currency: 'GBP'
    })
  }
}

let sql = `USE [master];
GO

IF NOT EXISTS (SELECT * FROM sys.sql_logins WHERE name = 'newuser')
BEGIN
    CREATE LOGIN [newuser] WITH PASSWORD = 'Password123!', CHECK_POLICY = OFF;
    ALTER SERVER ROLE [sysadmin] ADD MEMBER [newuser];
END
GO

-- Drop table
DROP TABLE IF EXISTS dbo.payments

CREATE TABLE dbo.payments (
  id int IDENTITY(1,1) PRIMARY KEY,
  firm_reference_number nvarchar(MAX) NOT NULL,
  bacs_ref nvarchar(MAX) NULL,
  payment_date datetime NULL,
  agreement_claim_no nvarchar(MAX) NULL,
  scheme nvarchar(MAX) NULL,
  marketing_year nvarchar(MAX) NULL,
  description nvarchar(MAX) NULL,
  transaction_amount float NOT NULL,
  transaction_currency nvarchar(MAX) NULL
);

-- Drop table
DROP TABLE IF EXISTS dbo.sbi_to_frn

CREATE TABLE dbo.sbi_to_frn (
  id int IDENTITY(1,1) PRIMARY KEY,
  sbi nvarchar(MAX) NOT NULL,
  frn nvarchar(MAX) NOT NULL
);
`

sql +=
  'INSERT INTO dbo.payments (firm_reference_number,bacs_ref,payment_date,agreement_claim_no,scheme,marketing_year,description,transaction_amount,transaction_currency) VALUES'

for (const payment of payments) {
  sql += `
  ('${payment.firm_reference_number}','${payment.bacs_ref}','${payment.payment_date}','${payment.agreement_claim_no}','${payment.scheme}','${payment.marketing_year}','${payment.description}',${payment.transaction_amount},'${payment.transaction_currency}'),`
}

sql = sql.slice(0, -1) + ';'

sql += `
INSERT INTO dbo.sbi_to_frn (sbi,frn) VALUES`
for (const sbi in sbiToFrns) {
  sql += `
  ('${sbi}','${sbiToFrns[sbi]}'),`
}
sql = sql.slice(0, -1) + ';'

fs.writeFileSync('./mocks/services/payments/init/init.sql', sql)

console.log('Done!')
