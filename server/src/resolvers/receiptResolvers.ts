import { processReceipt } from '../services/receiptService.js';
import { GraphQLError } from 'graphql';
import { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import { prisma } from '../prisma.js';

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
        const upload = await file;
        if (!upload) {
          throw new GraphQLError('No file received');
        }

        const { createReadStream } = upload;
        const stream = createReadStream();
        const chunks: Buffer[] = [];

        await new Promise<void>((resolve, reject) => {
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('end', resolve);
          stream.on('error', reject);
        });

        const buffer = Buffer.concat(chunks);

        if (!buffer || buffer.length === 0) {
          throw new GraphQLError('No file data received');
        }

        const receipt = await processReceipt(buffer);
        return receipt;
      } catch (error) {
        console.error('Error in uploadReceipt:', error);
        throw new GraphQLError(error instanceof Error ? error.message : 'Failed to process receipt');
      }
    },
  },
};

export default receiptResolvers;
