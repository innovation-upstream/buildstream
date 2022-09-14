import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/kil-san/buildstream-v1-test',
  cache: new InMemoryCache()
})

export default client
