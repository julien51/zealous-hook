const ethers = require('ethers')
const partners = require('../../../partners')
const fetch = require('cross-fetch')
const { ApolloClient, gql, HttpLink, InMemoryCache } = require('@apollo/client/core')

const APIURL = 'https://api.thegraph.com/subgraphs/name/julien51/zealous'

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${APIURL}`, fetch,
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  }),
  cache: new InMemoryCache()

})

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    const recipient = event.queryStringParameters.recipient
    if (!recipient) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'missing recipient'
        }),
      }

    }
    const tokensQuery = `
      query {
        tokens(first: 5 where: {owner: "${recipient}"}) {
          id
          tokenId
          contract
          owner
        }
      }
    `
    const results = await client
      .query({
        query: gql(tokensQuery),
      })
    if (!results.data.tokens[0]) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: '0x'
        }),
      }
    }
    const token = results.data.tokens[0]
    const data = ethers.utils.defaultAbiCoder.encode(['address', 'uint'], [token.contract, token.tokenId])
    return {
      statusCode: 200,
      body: JSON.stringify({
        data
      }),
    }
  } catch (error) {
    console.error(error)
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
