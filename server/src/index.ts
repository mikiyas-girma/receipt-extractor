import { ApolloServer } from '@apollo/server';
import express from 'express';
import { expressMiddleware } from '@as-integrations/express5';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import cors from 'cors';
import bodyParser from 'body-parser';
import typeDefs from './schema.js';
import resolvers from './resolvers/index.js';

const app = express();


// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


await server.start();


app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8000',
    'https://shewaber.mikegirma.dev',
    'https://www.shewaber.mikegirma.dev',
  ],
  credentials: true
}));

app.use(bodyParser.json());
app.use(graphqlUploadExpress());
app.use('/graphql', expressMiddleware(server));

// Start the server
const PORT = parseInt(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`The Server is ready at http://localhost:${PORT}/graphql`);
});
