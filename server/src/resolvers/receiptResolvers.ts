import { processReceipt } from '../services/receiptService.js';
import { GraphQLError } from 'graphql';
import { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import { prisma } from '../prisma.js';
import { validateImageUpload } from '../utils/fileValidator.js';

const receiptResolvers = {
  Query: {
    receipts: async () => {
      return await prisma.receipt.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' }
      });
    },

    receipt: async (_, { id }: { id: string }) => {
      const receipt = await prisma.receipt.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!receipt) {
        throw new GraphQLError('Receipt not found');
      }

      return receipt;
    }
  },

  Mutation: {
    uploadReceipt: async (_, { file }: { file: Promise<FileUpload> }) => {
      try {
        const buffer = await validateImageUpload(file);
        const receipt = await processReceipt(buffer);
        return receipt;
      } catch (error) {
        console.error('Error in uploadReceipt:', error);

        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError(error instanceof Error ? error.message : 'Failed to process receipt');
      }
    },
  },
};

export default receiptResolvers;
