# Sheba – Medicine Selling Backend API

**Sheba** is a backend API for an online medicine-selling platform that enables users to browse, purchase, and manage healthcare products seamlessly. Built with **Express.js**, **MongoDB**, **Firebase-admin** and **JWT authentication**, it supports a robust and secure architecture for both users and administrators.

##  Table of Contents

- [Sheba – Medicine Selling Backend API](#sheba--medicine-selling-backend-api)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
    - [Key Capabilities:](#key-capabilities)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running the project](#running-the-project)
      - [For production:](#for-production)
      - [For development:](#for-development)
    - [API endpoints](#api-endpoints)
      - [handle Medicine](#handle-medicine)
      - [handle user](#handle-user)
      - [handle cart](#handle-cart)
    - [Folder structure](#folder-structure)
---

## About

Sheba provides a RESTful API for managing users, medicines, orders, carts, and payments. It includes role-based access for admins and customers, with support for secure payments and dynamic inventory management.

### Key Capabilities:
- User authentication and role-based authorization
- Admin panel API for managing medicines and users
- Product filtering and search
- Cart and order management
- Secure checkout with payment gateway integration
- Error handling and validation middleware
- Clean and scalable project structure

---

## Features

- JWT-based Authentication
- Admin and User Roles
- CRUD operations for Medicines and Users
- Cart and Order APIs
- Payment Gateway Integration
- Hosting image in Imagebb
- RESTful API with clear structure
- MongoDB for flexible data storage

---

## Technology Stack

| Technology  | Usage                       |
|-------------|-----------------------------|
| Node.js     | JavaScript runtime          |
| Express.js  | Web framework               |
| Multer      | Handling form-data          |
| MongoDB     | NoSQL database              |
| ImageBB     | Hosting images              |
| Firebase-amin | Manage users              |
| JWT         | User authentication         |
| dotenv      | Environment variable config |
| SSLCOMMERZ  | Payment integration         |
| Postman     | API testing tool            |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Firebase
- ImageBB
- [SSLCOMMERZ](https://sslcommerz.com/) or your preferred payment service account

### Installation

```bash
git clone https://github.com/NafisOfficial/Sheba-Server.git
cd Sheba-Server
npm install
```
### Environment Variables
Create a .env file in the root directory and add the following:

```env
NODE_ENV=(development or production)
PORT=(Port for run server)

CONNECTION_STRING=(MongoDB connection string)

STORE_ID=(SSLCOMMERZ store id)
STORE_PASSWORD=(SSLCOMMERZ store password)

IMAGE_BB_SECRET=(ImageBB secret key)

FIREBASE_PROJECT_ID=(Firebase project id)
FIREBASE_PROJECT_KEY_ID=(Firebase project key)
FIREBASE_CLIENT_EMAIL=(Firebase client email)
FIREBASE_PRIVATE_KEY=(Firebase private key)

```
### Running the project
#### For production:
``` 
npm start
```
#### For development:
``` 
npm run dev
```
### API endpoints

base_url = http://localhost:3000
#### handle Medicine
common path = /drugs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET,POST | /all-drugs   |  get all drugs with limited info. Post a drug    |
|  DELETE  | /all-drugs/:id  | delete single drug |
|  GET      | /limited-drugs      | query : **page** and **limit** . Provide paginated data. Also provide total number of data|
| GET      | /category | query: **brand**, **dose**, **form**, **generic**, **company_name**. Provide filtered data.|
| GET   | /options  |query **opt1**, **opt2**, **opt2** Get distinct option according to field for set filter option. Exp: opt1=generic,opt2=brand,opt3=form|
| GET   | /single-drug/:id | get single drug with all field |

#### handle user 
common path= /users

| Method | Endpoint | Description |
---------|----------|--------------|
| GET    | /all    | get all user collection |
| GET   | /:email  | get user by email  |
| POST  | /        |  Post a user when signing in using firebase |
| PATCH | /update/:email | update user |
| DELETE | /delete/:email | Delete user |

#### handle cart
common path = /carts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET, POST | /   |  query: **user email**(for get req). Get and post cart |
| DELETE | /delete/all | delete added carts from admin|
| DELETE | /delete/singleCart| query: **user email** and **user _id**. Delete cart from user |
| POST  | /create-payment/:email | create payment|
| POST | /payment-success | post payment info and redirect |

### Folder structure