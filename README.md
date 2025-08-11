# Receipt Extractor

A sample test project for scanning supermarket or restaurant receipts, extracting structured data (store name, date, total amount, items), and storing results in a database.  
The system uses **Tesseract.js** for OCR, **Cloudinary** for image storage, and **Apollo GraphQL + Prisma** for data management.  
after you successfully run the application, you can upload a receipt image and it will extract the data and store it in the database. for testing purposes, you can use the provided sample receipt image in the `/assets` folder.


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
1. User uploads a receipt image from the Next.js frontend.
2. Apollo GraphQL API receives and validates the image.
3. The validated image is processed by Tesseract.js OCR to extract text.
4. Parsing logic structures the extracted data (store, date, total, items).
5. If parsing is successful, structured data is saved to PostgreSQL via Prisma.
6. The image is then uploaded to Cloudinary for storage.
7. Frontend queries and displays the results.

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
```
2️⃣ Create .env files

---

/client/.env with the following variables:
```env
NEXT_PUBLIC_API_URL=''
NEXT_NODE_ENV=''
NEXT_PUBLIC_GRAPHQL_ENDPOINT=''
```

/server/.env with the following variables:
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
### 3️⃣ Start the application
#### be sure to run this command from the root of the repository folder
```bash
docker-compose up --build
```
or in detached mode
```bash
docker-compose up --build -d
```

### 4️⃣ Access the application
- Frontend: [http://localhost:3000](http://localhost:3000)
- Apollo Server: [http://localhost:5000/graphql](http://localhost:5000/graphql)



### 5️⃣ Quick Start (Recommended)
1. Clone this repository:
   ```bash
   git clone https://github.com/mikiyas-girma/receipt-extractor.git
   cd receipt-extractor
   ```
2. Create the required `.env` files in both the `/client` and `/server` folders (see above for variable examples).
3. Make sure Docker & Docker Compose are installed and running.
4. From the root directory, run:
   ```bash
   docker-compose up --build
   ```
That's it! The application will build and start both the frontend and backend containers as defined in `docker-compose.yml`.
