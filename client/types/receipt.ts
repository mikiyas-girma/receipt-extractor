export interface ReceiptItem {
  name: string
  quantity?: number
}

export interface ReceiptData {
  id: string
  storeName?: string
  purchaseDate?: string
  totalAmount: number
  imageUrl: string
  items?: ReceiptItem[]
  createdAt: string
}
