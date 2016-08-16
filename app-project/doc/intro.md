# Introduction to app-project

## Requirements

### Statement of Purpose

The purpose of this web application is to facilitate the Adherence Perceptions Project, a study that explores health care providers definitions of adherence. 

This application must: 

* Serve default web content (HTML, JS, CSS)
* Provide anonymous login identifiers 
* Permit the creation and storage of survey style questions and questionaires.
    - Store user responses
    - Customizable formats (as per front-end). 
* Provide an administrator dashboard where:
    - participants may be managed.
    - results may be viewed - by participant
    - administrator login
    - questions (survey style and timeline) questions may be managed.

## API Definitions

All API routes here are described here. HTTP requests to the API should be prefixed with: `/api`

### Default/Status Routes

Routes for checking the API status. 

* **GET `/api/`** - should respond with `APP API Success Response` or similar.
 
### Authentication

Routes for authenticating users. 
 
* **POST `/api/auth`

### User Management Routes

Routes for managing user accounts. 

* **GET `/api/user`** - lists users in the system, responds with a list of current users and associated meta-data. 
* **POST `/api/user`** - makes a new user in the system, expects JSON payload with new user information.
* **DELETE `/api/user/<name>`** - deletes the user record (but not any responses they have provided). 
* **GET `/api/user/<name>`** - gets detailed meta-data for the specific user, includes responses to questions. 

### Questionnaire Routes

Routes for getting questions and answers.

#### Question Types

Several question types are supported: 

1) Multiple choice
2) Timeline
    * Intervals
3) Short textual answer

* **GET `/api/question/<number>`** - the identifier of the question is passed as number, the question (meta-)data is returned in JSON format. 
* **POST `/api/question/<number>`** - the identifier of the question is passed as a number, the response is included as a JSON payload in the request body.
* **POST `/api/question/`** - makes a new question, the body of the request contains a JSON payload with question details. 