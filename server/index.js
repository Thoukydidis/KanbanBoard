require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const service = require('./Service/index');

const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolver');

const server = new ApolloServer({ typeDefs, resolvers });

service.initDatabase();

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port 4000
  `);
});
