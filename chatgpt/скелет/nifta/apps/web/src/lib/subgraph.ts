import { GraphQLClient, gql } from 'graphql-request';

export const client = new GraphQLClient(process.env.NEXT_PUBLIC_SUBGRAPH_URL || '');

export const QUERY_TRENDING = gql`
  query TrendingPlaceholder { _meta { block { number } } }
`;
