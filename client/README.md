# Receipt Extractor Frontend (Next.js + shadcn/ui)

This is the **Next.js + TypeScript** frontend for uploading receipt images and displaying extracted OCR results from the GraphQL backend.

---

## ✨ Features

- Drag-and-drop or click-to-upload receipts
- File validation (type & size)
- Upload progress bar
- OCR processing status indicators
- Results display (store name, date, total, items)

---

## 🛠 Tech Stack

- **Next.js 15** (TypeScript, App Router)
- **shadcn/ui** + TailwindCSS
- **Apollo Client**
- **React Dropzone** (file uploads)

---

## 📦 Environment Variables
To run the frontend, create a `.env` file in the client directory with the following variables:

```env
NEXT_PUBLIC_NODE_ENV=''
NEXT_PUBLIC_GRAPHQL_ENDPOINT=''
```

## 🐳 Docker Usage
To run the frontend in a Docker container, use the following command:

```bash
docker-compose up --build client
```

## 📂 Folder Structure
```bash
client/
├── app/
├── ├── upload/
├── ├── receipt/[id]
├── components/
├── ├── ui/
