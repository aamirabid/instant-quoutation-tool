# Permit Instant Quote

A Node.js + Express.js project for handling permit instant quote requests, storing submissions in JSON, and integrating Google Maps API for address input.

---

## Pre-requisites

Before you start, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Installation & Setup

### Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Inside the root folder, create a file named `.env.development.local` and add the following content:

```env
# PORT
PORT=3000

# ENVIRONMENT
NODE_ENV=development

# GOOGLE MAP
GOOGLE_MAP_KEY=your_google_api_key_here

# TOKEN
SECRET_KEY=secretKey

# LOG
LOG_FORMAT=dev
LOG_DIR=../logs

# CORS
ORIGIN=*
CREDENTIALS=false

# DATABASE
DB_URL=mongodb://localhost:27017/
DB_HOST=localhost
DB_PORT=27017
DB_DATABASE=permit-instant-quote
```

Replace `your_google_api_key_here` with your actual Google Maps API Key.

---

### Start the Development Server

```bash
npm run dev
```

---

### Access the Application

- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **API Documentation (Swagger)**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- ** For Data **: you can find ./quotes-db.json file

---

## Features

- Stores all form submissions in **JSON format** with:

  - All form fields
  - Final quote amount
  - Timestamp
  - Quote reference number

- Integrated **Google Maps Address Autocomplete** in the address field.
- Swagger API documentation.

---

## Technology Stack

- **Backend**: Node.js, Express.js
- **API Docs**: Swagger
- **Maps Integration**: Google Maps JavaScript API

---

## Notes

- For production, create a `.env.production.local` file with production credentials.

```

```
