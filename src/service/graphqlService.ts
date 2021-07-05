import { ApolloClient, InMemoryCache } from '@apollo/client';

const GRAPHQL_URL = 'http://localhost:4000';

const client = new ApolloClient({ uri: GRAPHQL_URL, cache: new InMemoryCache() });

export default client;
