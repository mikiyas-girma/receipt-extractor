"use client"

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import createUploadLink  from "apollo-upload-client/createUploadLink.mjs"

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT 
    : "http://localhost:5000/graphql",
  headers: {
    "apollo-require-preflight": "true",
  },
})
console.log("NODE_ENV:", process.env.NEXT_PUBLIC_NODE_ENV)
console.log("GraphQL Endpoint:", process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT)

const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
