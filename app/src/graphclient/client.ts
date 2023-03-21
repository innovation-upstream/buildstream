import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://thegraph.com/explorer/subgraph/kil-san/buildstream-v2',
  cache: new InMemoryCache()
})

export default client
