import { gql } from "@apollo/client";

export const CREATE_ADR = gql`
  mutation CreateHome($input: CreateHomeInput!) {
    createHome(input: $input) {
      id
    }
  }
`;

export const UPDATE_ADR = gql`
  mutation UpdateHome($homeId: Float!, $input: UpdateHomeInput!) {
    updateHome(homeId: $homeId, input: $input) {
      id
    }
  }
`;
