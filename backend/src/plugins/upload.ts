import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import multipart from '@fastify/multipart';
import { uploadToCloudinary } from '../config/cloudinary';
import stream from 'stream';

declare module 'fastify' {
  interface FastifyInstance {
    uploadFile: (request: FastifyRequest, fieldName: string) => Promise<string>;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(multipart, {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  });

  fastify.decorate('uploadFile', async (request: FastifyRequest, fieldName: string): Promise<string> => {
    const data = await request.file(fieldName);
    if (!data) throw new Error('No file uploaded');

    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      data.file.on('data', (chunk: Buffer) => buffers.push(chunk));
      data.file.on('end', () => {
        const buffer = Buffer.concat(buffers);
        uploadToCloudinary(buffer)
          .then(resolve)
          .catch(reject);
      });
      data.file.on('error', reject);
    });
  });
});