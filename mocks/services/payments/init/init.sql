USE [master];
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
INSERT INTO dbo.payments (firm_reference_number,bacs_ref,payment_date,agreement_claim_no,scheme,marketing_year,description,transaction_amount,transaction_currency) VALUES
  ('92cba95e-37dc-4afd-a3a1-ad7585a82112','XK692380092709718065','2023-08-08T16:16:27','1641241','RDPE','2021','Audio laudantium patrocinor ascisco adduco bellicus comburo tolero asper. Tero ciminatio temeritas spargo vulgus degero defendo. Cupiditate arx supra conturbo truculenter adfero sodalitas.',7.67,'GBP'),
  ('92cba95e-37dc-4afd-a3a1-ad7585a82112','DO75YOMW28806808810406820425','2023-12-08T11:48:46','1646335','ES','2020','Verbum cultellus tantillus incidunt spiculum uberrime. Porro repudiandae tristis verto tenus adnuo angustus velum pauper utroque. Consequuntur decerno depopulo.',919.80,'GBP');
INSERT INTO dbo.sbi_to_frn (sbi,frn) VALUES
  ('107183280','92cba95e-37dc-4afd-a3a1-ad7585a82112'),
  ('107591843','d72dafb2-a12f-440a-81c9-2f59ae0e12b5');