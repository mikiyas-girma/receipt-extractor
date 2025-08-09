# Receipt Extractor

A sample test project for scanning supermarket or restaurant receipts, extracting structured data (store name, date, total amount, items), and storing results in a database.  
The system uses **Tesseract.js** for OCR, **Cloudinary** for image storage, and **Apollo GraphQL + Prisma** for data management.  
Frontend built with **Next.js + TypeScript + shadcn/ui**.

---

## 📂 Repository Structure

/client → Next.js + shadcn/ui frontend
/server → Apollo GraphQL + Prisma backend


- 📄 **[Client README](./client/README.md)** – Frontend details and setup  
- 📄 **[Server README](./server/README.md)** – Backend details and setup  

---

## ✨ Features

- Upload receipts from the frontend.
- Cloud image storage with **Cloudinary**.
- OCR extraction using **Tesseract.js**.
- Data parsing with Regex to extract store name, date, total, and purchased items.
- PostgreSQL storage with Prisma ORM.
- GraphQL API for querying receipts and their items.
- Fully containerized with Docker & Docker Compose.

---

## 🛠 Tech Stack

**Frontend**
- Next.js 15 (TypeScript, App Router)
- shadcn/ui
- Apollo Client
- TailwindCSS

**Backend**
- Node.js + Apollo Server
- Prisma ORM
- PostgreSQL
- Tesseract.js OCR
- Cloudinary (image hosting)

---

## 🖥 System Architecture

<!-- The following diagram shows how the components interact: -->

<!-- ![System Architecture](./root_readme_architecture.png) -->

**Flow Overview:**
1. User uploads receipt from the Next.js frontend.
2. Apollo GraphQL API receives the file and uploads it to Cloudinary.
3. Cloudinary stores the image and provides a public URL.
4. Tesseract.js processes the image and extracts text.
5. Parsing logic structures the data (store, date, total, items).
6. Prisma saves structured data into PostgreSQL.
7. Frontend queries and displays results.

---

## 📦 Prerequisites

- **Docker** & **Docker Compose**
- Cloudinary account for storing images
- `.env` files in `/client` and `/server`

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/mikiyas-girma/receipt-extractor.git
cd receipt-extractor

2️⃣ Create .env files
/client/.env
```env
NEXT_PUBLIC_API_URL=''
NEXT_NODE_ENV=''
NEXT_PUBLIC_GRAPHQL_ENDPOINT=''
```

/server/.env
```env
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

# dockerhub
DOCKERHUB_USERNAME=''
DOCKERHUB_TOKEN=''

```
### 3️⃣ Start the application
```bash
docker-compose up --build
```
or in detached mode
```bash
docker-compose up --build -d
```
