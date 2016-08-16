# APP Project Integration Tests

A set of integration tests for the Adherence Persistence Project web application. Tests focus on the REST API (`/api/xxxx`). 

These tests are meant to be run using the [Postman](https://www.getpostman.com/) and the associated command-line tool [Newman](https://github.com/postmanlabs/newman).  

## Prerequsites

The test suite collections/files (in `./postman/*.json`) are editable via the Postman UI, and perhaps via editing the JSON files themselves. 

You must have installed: 

* **NodeJS:** Version > 4.0
* **Postman:** (optional), download the app at: [https://www.getpostman.com/](https://www.getpostman.com/). 
* **Newman:** command-line utility, required to run tests from command line. Install via: `npm install -g newman`, see instructions at: [https://github.com/postmanlabs/newman](https://github.com/postmanlabs/newman). 

### Running Tests

Run tests by running: 

* `$ newman run <path-to-collection>`, e.g. `$ newman run postman/app-project-api.postman_collection.json`

Run all tests by running: 

* `$ ./run-integration-tests.sh` (make sure it is executable file permissions). 

This command will run all test collections that match `postman/*.json`, i.e. are in the `postman/` and are json files.

## Working in Postman Tool UI 

Use the Postman UI (application) to edit collections and define tests for responses. 
