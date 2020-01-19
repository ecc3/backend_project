# Northcoders News API

## Background

This API is designed to serve information from the Northcoders News application about its users, discussion topics, articles and comments.

## Setup

A live production version of this project can be viewed, following the link below. Alternatively, this project can also be installed locally and run for development and testing purposes.

## Production

The production version of this app is hosted using heroku. The information stored in this database can be accessed at this [domain](https://ec-nc-news.herokuapp.com/api/) using the API set up in this respository.

The endpoint `/api` serves up a JSON object listing all possible endpoints and a description of how to access the data with example responses.

## Prerequisites for running locally

First git clone this project, by running in the terminal:

```bash
git clone https://github.com/ecc3/backend_project.git
```

You will need to install the following packages in order to run this project. In the command line run:

```bash
npm install
```

This project uses Node v13.5.0 so you may need to update.

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

When you are ready to start a local version of this project, run:

```bash
npm start
```

And navigate to localhost:9090/api/ in your browser or HTTP client, where you will see the list of endpoints with a description of the data they serve.

## Running the tests

Two test scripts exist within the spec directory: app.spec.js and utils.spec.js.

---

The app.spec file is used to test the functionality of application. It tests that the routers and endpoints have been set up successfully. It tests that the controller functions (found within the controllers directory) and models (found within the models directory) are sending back the required data in the correct format. It also implicitly tests that the migrations have been successful, and the database is structured in the way that we expect.

These tests can be run using the command:

```bash
npm test
```

Running this command will automatically set the environment to test, rollback the database, migrate latest and reseed the database before running the test file. This ensures the test environment is reset between tests.

The utils.spec.js file is used to test the util functions used within the seed file. The util functions can be found in utils/utils.js.

---

The util tests can be run using the command:

```bash
npm run test-utils
```
