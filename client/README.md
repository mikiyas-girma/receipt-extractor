# Receipt Extractor Frontend

This is the **Next.js + TypeScript** frontend for uploading receipt images and displaying extracted OCR results from the GraphQL backend.

---

## ✨ Features

- Drag-and-drop or click-to-upload receipts
- File validation (type & size)
- Upload progress bar
- OCR processing status indicators
- Results display (store name, date, total, items)
- Dashboard pages for viewing all receipts images, display stored parsed data and export options

---

## 🛠 Tech Stack

- **Next.js 15** (TypeScript, App Router)
- **shadcn/ui** + TailwindCSS
- **Apollo Client**
- **React Dropzone** (file uploads)

---

To run the frontend, navigate to the `client` directory
---
create a `.env` file with the following variables:

## 📦 Environment Variables

```bash
```env
NEXT_PUBLIC_NODE_ENV='development'
NEXT_PUBLIC_GRAPHQL_ENDPOINT='http://localhost:5000/graphql'
```

## Install Dependencies
```bash
pnpm install
```
## Run the Development Server
```bash
pnpm dev
```

Then, access the frontend at `http://localhost:3000`.

## 🐳 Or with Docker Usage
To run the frontend in a Docker container, use the following command:

```bash

docker build -t receipt-extractor-client .
```

Then, start the container with:

```bash
docker run -p 3000:3000 receipt-extractor-client
```
Then, access the frontend at `http://localhost:3000`.
