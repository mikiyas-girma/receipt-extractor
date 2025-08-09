# Receipt Extractor Backend (Apollo GraphQL + Prisma + Tesseract.js)

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

## 📦 Environment Variables

**`.env`**
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

```


---

## 📜 Scripts

```bash
pnpm dev                 # Start dev server with hot reload
pnpm build               # Compile TypeScript & generate Prisma client
pnpm start               # Run compiled code
pnpm prisma:generate     # Generate Prisma client
pnpm prisma:migrate      # Apply DB migrations
```

## 🐳 Docker Usage
```bash
docker-compose up --build server
```

