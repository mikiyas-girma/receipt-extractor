import { GraphQLError } from 'graphql';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const MAX_FILE_SIZE = 7 * 1024 * 1024; // 7MB

export async function validateImageUpload(filePromise) {
  const upload = await filePromise;
  if (!upload) {
    throw new GraphQLError('No file received');
  }

  const { createReadStream, mimetype, filename } = upload;

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(mimetype)) {
    throw new GraphQLError(`Invalid file type. Only JPEG and PNG images allowed. Received: ${mimetype}`);
  }

  // Check file extension
  const extension = filename.toLowerCase().split('.').pop();
  if (!['jpg', 'jpeg', 'png'].includes(extension)) {
    throw new GraphQLError(`Invalid file extension: .${extension}`);
  }

  // Process stream and check size
  const stream = createReadStream();
  const chunks = [];
  let totalSize = 0;

  await new Promise((resolve, reject) => {
    stream.on('data', (chunk) => {
      totalSize += chunk.length;
      if (totalSize > MAX_FILE_SIZE) {
        stream.destroy();
        reject(new GraphQLError('File size exceeds 7MB limit'));
        return;
      }
      chunks.push(chunk);
    });

    stream.on('end', resolve);
    stream.on('error', (error) => reject(new GraphQLError(`Upload error: ${error.message}`)));
  });

  const buffer = Buffer.concat(chunks);
  if (buffer.length === 0) {
    throw new GraphQLError('No file data received');
  }

  return buffer;
}
