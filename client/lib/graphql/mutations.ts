import { gql } from "@apollo/client"

export const UPLOAD_RECEIPT = gql`
  mutation UploadReceipt($file: Upload!) {
    uploadReceipt(file: $file) {
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
