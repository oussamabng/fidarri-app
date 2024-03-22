import { gql } from "@apollo/client";

export const MISSIONS = gql`
  query Missions($where: FilterMissionInput) {
    missions(where: $where) {
      id
    }
  }
`;
