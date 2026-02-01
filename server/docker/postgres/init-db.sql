SELECT 'CREATE DATABASE dev_test OWNER app'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dev_test')\gexec
