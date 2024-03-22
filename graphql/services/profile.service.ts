import {
  GET_CLIENT,
  GET_FREELANCER,
  GET_USER,
  OFFICES_AVAILABILITY,
  UPDATE_CLIENT,
} from "@/graphql/queries/profile.query";
import { MISSIONS } from "@/graphql/queries/missions.query";
import client from "@/graphql/config";

export const getClientInformations = async (userId: number, access: string) => {
  try {
    const { data } = await client.query({
      query: GET_CLIENT,
      variables: {
        userId,
      },
      context: { accessToken: access },
    });
    return {
      error: false,
      data: data?.client,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};
export const getFreelancerInformations = async (
  userId: number,
  access: string
) => {
  try {
    const { data } = await client.query({
      query: GET_FREELANCER,
      variables: {
        userId,
      },
      context: { accessToken: access },
    });
    return {
      error: false,
      data: data?.freelancer,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getUser = async (userId: number, access: string) => {
  try {
    const { data } = await client.query({
      query: GET_USER,
      variables: {
        userId,
      },
      context: { accessToken: access },
      fetchPolicy: "no-cache",
    });
    return {
      error: false,
      data: data?.user,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getOfficesAvailable = async (from: string) => {
  try {
    const { data } = await client.query({
      query: OFFICES_AVAILABILITY,
      variables: {
        from,
      },
    });
    return {
      error: false,
      data: data?.officesAvailability,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const updateClientInformations = async (
  userId: number,
  access: string,
  firstName: string,
  lastName: string,
  username: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_CLIENT,
      variables: {
        userId,
        input: {
          firstName,
          lastName,
          username,
        },
      },
      context: { accessToken: access },
    });
    return {
      error: false,
      data: data?.updateUser,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const updatePhone = async (
  userId: number,
  access: string,
  phoneNumber: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_CLIENT,
      variables: {
        userId,
        input: {
          phoneNumber,
        },
      },
      context: { accessToken: access },
    });
    return {
      error: false,
      data: data?.updateUser,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const updateClientPicture = async (
  userId: number,
  access: string,
  profilePictureUrl: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_CLIENT,
      variables: {
        userId,
        input: {
          profilePictureUrl,
        },
      },
      context: { accessToken: access },
    });
    return {
      error: false,
      data: data?.updateUser,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const missionsCompletedForClient = async (
  userId: number,
  access: string,
  role: string
) => {
  try {
    const { data } = await client.query({
      query: MISSIONS,
      variables: {
        where: {
          status: "Completed",
          hiring: {
            offer: {
              client: {
                id: role === "client" ? userId : null,
              },
              freelancer: {
                id: role !== "client" ? userId : null,
              },
            },
          },
        },
      },
      context: { accessToken: access },
    });
    return {
      error: false,
      data: data?.missions,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};
