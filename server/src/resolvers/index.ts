import receiptResolvers from './receiptResolvers.js';
import { prisma } from '../prisma.js';


// Merge resolvers
const resolvers = {
  Query: {
    ...receiptResolvers.Query,
  },
  Mutation: {
    ...receiptResolvers.Mutation,
  },
};

export default resolvers; 
