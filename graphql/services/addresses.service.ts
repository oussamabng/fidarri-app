import { GET_ADDRESSES } from "@/graphql/queries/addresses.query";
import client from "@/graphql/config";
import { CREATE_ADR, UPDATE_ADR } from "../mutations/addresses.mutation";

export const getClientAddresses = async (
  skip: number,
  take: number,
  id: number,
  access: string,
  isFreelancer?: boolean
) => {
  try {
    const { data } = await client.query({
      query: GET_ADDRESSES,
      variables: {
        options: {
          skip,
          take,
          sortBy: {
            id: "ASC",
          },
          where: isFreelancer
            ? { id }
            : {
                client: {
                  id,
                },
              },
        },
      },
      context: { accessToken: access },
      fetchPolicy: "no-cache",
    });
    return {
      error: false,
      data: data?.paginatedHomes,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const createClientAddresses = async (
  userId: number,
  access: string,
  city: string,
  state: string,
  street: string,
  zipCode: string,
  numberOfPieces: number
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_ADR,
      variables: {
        input: {
          address: {
            city,
            state,
            street,
            zipCode,
          },
          clientId: userId,
          numberOfPieces,
        },
      },
      context: { accessToken: access },
    });
    return {
      error: false,
      data: data?.createHome,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const updateClientAddresses = async (
  userId: number,
  homeId: number,
  access: string,
  city: string,
  state: string,
  street: string,
  zipCode: string,
  numberOfPieces: number
) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_ADR,
      variables: {
        homeId,
        input: {
          address: {
            city,
            state,
            street,
            zipCode,
          },
          clientId: userId,
          numberOfPieces,
        },
      },
      context: { accessToken: access },
    });
    return {
      error: false,
      data: data?.updateHome,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};
