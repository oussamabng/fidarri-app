import { gql } from "@apollo/client";

export const GET_ADDRESSES = gql`
  query PaginatedHomes($options: FetchHomesArgs!) {
    paginatedHomes(options: $options) {
      totalCount
      hasNextPage
      nodes {
        id
        numberOfPieces
        address {
          city
          state
          street
          zipCode
          building
        }
      }
    }
  }
`;
