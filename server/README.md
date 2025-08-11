# Receipt Extractor Backend

This is the **Node.js + Apollo Server** backend for processing receipt images, performing OCR with **Tesseract.js**, parsing structured data, and storing results in PostgreSQL.

---

## ✨ Features

- GraphQL API with queries & mutations
- File uploads (`graphql-upload`)
- Cloudinary for image hosting
- OCR with Tesseract.js
- Regex-based text parsing
- Prisma ORM for database management

---

## 🛠 Tech Stack

- Node.js
- Apollo Server v5
- Prisma ORM
- PostgreSQL
- Cloudinary
- Multer (file handling)
- Sharp (image optimization)
- Tesseract.js (OCR)

---
To run the server, navigate to the `server` directory
---
create a `.env` file with the following variables:

## 📦 Environment Variables

**`.env`**
```env
PORT=5000

# Database
POSTGRES_USER=''
POSTGRES_PASSWORD=''
POSTGRES_DB=''

# Prisma
DATABASE_URL=''

# cloudinary
CLOUDINARY_NAME=''
CLOUDINARY_API_KEY=''
CLOUDINARY_SECRET=''
```

## 🐳 Docker Usage
To run the frontend in a Docker container, use the following command:

```bash

docker build -t receipt-extractor-server .
```

Then, start the container with:

```bash
docker run -p 5000:5000 receipt-extractor-server
```
Then, access the graphql apollo server at `http://localhost:5000/graphql`.
