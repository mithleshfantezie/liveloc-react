import { GraphQLClient } from 'graphql-request';

const client =  new GraphQLClient('https://radiant-lake-34932.herokuapp.com/graphql')

export { client as default}