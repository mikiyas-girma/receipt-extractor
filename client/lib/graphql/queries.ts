import { gql } from "@apollo/client"

export const GET_RECEIPT = gql`
  query GetReceipt($id: String!) {
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
