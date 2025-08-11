import { gql } from "@apollo/client"

export const GET_RECEIPTS = gql`
  query GetReceipts($startDate: String, $endDate: String, $storeName: String) {
    receipts(startDate: $startDate, endDate: $endDate, storeName: $storeName) {
      id
      storeName
      purchaseDate
      totalAmount
      imageUrl
      items {
        name
        quantity
      }
      createdAt
    }
  }
`

export const GET_RECEIPT_IMAGES = gql`
  query GetReceiptImages($startDate: String, $endDate: String, $storeName: String) {
    receipts(startDate: $startDate, endDate: $endDate, storeName: $storeName) {
      id
      imageUrl
      storeName
      purchaseDate
      totalAmount
      createdAt
    }
  }
`

export const GET_RECEIPT = gql`
  query GetReceipt($id: ID!) {
    receipt(id: $id) {
      id
      storeName
      purchaseDate
      totalAmount
      imageUrl
      items {
        name
        quantity
      }
      createdAt
    }
  }
`
