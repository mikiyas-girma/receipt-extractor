import receiptResolvers from './receiptResolvers.js';
import GraphQLUpload  from 'graphql-upload/GraphQLUpload.mjs';
// Merge resolvers
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...receiptResolvers.Query,
  },
  Mutation: {
    ...receiptResolvers.Mutation,
  },
};

export default resolvers; 
