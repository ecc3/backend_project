# Northcoders News API

## Background

This API is designed to serve information from the Northcoders News application about its users, discussion topics, articles and comments.

## Setup

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See production for notes on how to use the project on a live system.

## Prerequisites

You will need to install the following packages in order to run this project. In the command line input:

```bash
npm install express knex pg fs
```

And for testing:

```bash
npm install -D chai mocha supertest
```

Clone the project and remove git origin.

## Running your app

To create your test and development databases run the setup.sql file using the command:

```bash
npm run setup-dbs
```

To setup the schema for your development database from the command line run:

```bash
npm run migrate-latest
```

To seed your development database using the development data contained within db/data/development-data in this repository use:

```bash
npm run seed
```

If you wish to make changes to the schema of the database, it is possible to use knex to generate a migration file. When executed, this migration file will update the schema of the database. Command migrate-make can be used:

```bash
npm run migrate-make
```

Or to rollback the database schema completely:

```bash
npm run migrate-rollback
```

## Running the tests

Two test scripts exist within the spec directory.

├── spec
│ ├── app.spec.js
│ └── utils.spec.js

---

The app.spec file is used to test the functionality of application. It tests that the routers and endpoints have been set up successfully. It tests that the controller functions (found within the controllers directory) and models (found within the models directory) are sending back the required data in the correct format. It also implicitly tests that the migrations have been successful, and the database is structured in the way that we expect.

These tests can be run using the command:

```bash
npm test
```

Running this command will automatically set the environment to test, rollback the database, migrate latest and reseed the database before running the test file. This ensures the test environment is reset between tests.

The utils.spec file is used to test the util functions used within the seed file. The util functions can be found in:

---

├──utils
| └──utils.js

---

The util tests can be run using the command:

```bash
npm run test-utils
```

## Production

The production database of this app is hosted using heroku. The information stored in this database can be accessed at this [domain](https://ec-nc-news.herokuapp.com/) using the API set up in this respository. Using the endpoint `/api` will serve up a JSON object with all possible endpoints and a description of what data each endpoint serves.
