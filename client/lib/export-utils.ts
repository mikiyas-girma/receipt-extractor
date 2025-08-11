import type { ReceiptData } from "@/types/receipt"

export function exportToCSV(data: ReceiptData[]) {
  const headers = ["ID", "Store Name", "Purchase Date", "Total Amount", "Items Count", "Image URL"]

  const csvContent = [
    headers.join(","),
    ...data.map((receipt) =>
      [
        receipt.id,
        `"${receipt.storeName || "Unknown"}"`,
        receipt.purchaseDate || "",
        receipt.totalAmount || 0,
        receipt.items?.length || 0,
        receipt.imageUrl || "",
      ].join(","),
    ),
  ].join("\n")

  downloadFile(csvContent, "receipts.csv", "text/csv")
}

export function exportToJSON(data: ReceiptData[]) {
  const jsonContent = JSON.stringify(data, null, 2)
  downloadFile(jsonContent, "receipts.json", "application/json")
}

function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
