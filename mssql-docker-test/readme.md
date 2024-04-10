# MSSQL Server
Simple MS SQL server to test db connection

run:
1. Navigate to `mssql-docker-test`
2. Run `docker-compose up`
3. Connect with sample script: `AUTHENTICATE_DB_USERNAME=sa AUTHENTICATE_DB_PASSWORD=password123 AUTHENTICATE_DB_HOST=localhost AUTHENTICATE_DB_TABLE=master node auth-test-sql.js`