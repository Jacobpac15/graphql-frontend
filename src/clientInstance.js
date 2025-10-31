import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://graphql-backend-h107.onrender.com/", // ✅ tu backend en la nube
  cache: new InMemoryCache(),
});

export default client;
