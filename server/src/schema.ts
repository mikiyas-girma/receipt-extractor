const typeDefs = `#graphql
  # Scalar for handling file uploads
  scalar Upload

  type Item {
    id: ID!
    name: String!
    quantity: Int
  }

  type Receipt {
    id: ID!
    storeName: String!
    purchaseDate: String!
    totalAmount: Float!
    imageUrl: String!
    items: [Item!]!
    createdAt: String!
  }

  type Query {
    receipts: [Receipt!]!
  }

  type Mutation {
    uploadReceipt(file: Upload!): Receipt!
  }
`;

export default typeDefs;
