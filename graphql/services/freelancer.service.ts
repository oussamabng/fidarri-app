import {
  FREELANCERS,
  FREELANCERS_AVAILABILITY,
  FREELANCER_PROFILE,
  GET_FREELANCERS_AVAILABILITY,
  GET_FREELANCER_PROFILE,
  GET_FREELANCER_REVIEWS,
  GET_PAGINATED_CLIENT_OFFERS,
  GET_PAGINATED_MISSIONS,
  INVOICES,
  MISSIONS_GRAPH,
  MISSIONS_STATS,
  NUMBER_OF_NOTIFS,
  NUMBER_OF_NOTIFS_SUB,
  TOP_RATING_FREELANCERS,
} from "@/graphql/queries/freelancers.query";
import client from "@/graphql/config";
import {
  ACCEPT_MISSION,
  ACCEPT_OFFER,
  CANCEL_OFFER,
  COMPLETE_HIRING,
  CREATE_CLIENT_REVIEW,
  CREATE_FREELANCER_AVAILABILITY,
  CREATE_FREELANCER_REVIEW,
  CREATE_HIRING,
  CREATE_MISSION,
  CREATE_OFFER,
  DELETE_FREELANCER_AVAILABILITY,
  LINK_PROMO_OFFER,
  MARK_AS_SEEN,
  REJECT_OFFER,
  RESET_PASSWORD_OTP,
  SEND_OFFER,
  START_MISSION,
  SUBMIT_INVOICE,
} from "../mutations/operations.mutation";
import {
  CLIENT_REVIEWS,
  FREELANCER_REVIEWS,
  GET_NOTIFICATIONS,
} from "../queries/profile.query";

export const getTopRatingFreelancers = async (access: string) => {
  try {
    const { data } = await client.query({
      query: TOP_RATING_FREELANCERS,
      context: { accessToken: access },
      fetchPolicy: "no-cache",
    });
    return {
      error: false,
      data: data?.topRatingFreelancers,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getFreelancersReviews = async (
  access: string,
  freelancerId: number,
  skip: number,
  take: number
) => {
  try {
    const { data } = await client.query({
      query: GET_FREELANCER_REVIEWS,
      context: { accessToken: access },
      variables: {
        freelancerId,
        options: {
          skip,
          take,
        },
      },
      fetchPolicy: "no-cache",
    });
    return {
      error: false,
      data: data?.paginatedFreelancerReviews,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getMissionGraph = async (
  access: string,
  interval: "DAY" | "WEEK" | "MONTH",
  startDate: string,
  endDate: string
) => {
  try {
    const { data } = await client.query({
      query: MISSIONS_GRAPH,
      context: { accessToken: access },
      variables: {
        input: {
          interval,
          endDate: new Date().toISOString(),
          startDate: "1971-01-01T09:54:33Z",
        },
      },
    });
    return {
      error: false,
      data: data?.missionsGraph,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getFreelancers = async (
  access: string,
  skip: number,
  take: number,
  search: string,
  freelancer_type: string | null,
  type: string | null,
  date: any
) => {
  try {
    const { data } = await client.query({
      query: FREELANCERS,
      context: { accessToken: access },
      variables: {
        options: {
          skip,
          sortBy: {
            createdAt: "ASC",
          },
          take,
          where: {
            accountStatus: "VERIFIED",
            applicationStatus: "Verified",
            search,
            freelancer_type,
            availability: {
              type,
              date,
            },
          },
        },
      },
      fetchPolicy: "no-cache",
    });
    return {
      error: false,
      data: data?.freelancers,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getNotifications = async (
  accessToken: string,
  skip: number,
  take: number
) => {
  try {
    const { data } = await client.query({
      query: GET_NOTIFICATIONS,
      context: { accessToken },
      variables: {
        options: {
          skip,
          sortBy: {
            createdAt: "DESC",
          },
          take,
        },
      },
      fetchPolicy: "no-cache",
    });
    return {
      error: false,
      data: data?.myNotifications,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getReviews = async (
  accessToken: string,
  skip: number,
  take: number,
  userId: number,
  role: "client" | "freelancer"
) => {
  const isClient = role === "client";
  const variables = isClient
    ? {
        clientId: +userId,
        options: {
          skip,
          take,
        },
      }
    : {
        freelancerId: +userId,
        options: {
          skip,
          take,
        },
      };
  try {
    const { data } = await client.query({
      query: isClient ? CLIENT_REVIEWS : FREELANCER_REVIEWS,
      context: { accessToken },
      variables,
      fetchPolicy: "no-cache",
    });
    return {
      error: false,
      data: isClient
        ? data?.paginatedClientReviews
        : data?.paginatedFreelancerReviews,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getPaginatedFreelancerAvailability = async (
  freelancerId: number,
  skip: number,
  take: number
) => {
  try {
    const { data } = await client.query({
      query: GET_FREELANCERS_AVAILABILITY,
      variables: {
        freelancerId,
        options: {
          where: {
            date: new Date().toISOString(),
          },
          skip,
          take,
        },
      },
    });

    return {
      error: false,
      data: data?.paginatedFreelancerAvailability,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getPaginatedMissions = async (access: string, variables: any) => {
  try {
    const { data }: any = await client.query({
      query: GET_PAGINATED_MISSIONS,
      variables: variables,
      context: { accessToken: access },
      fetchPolicy: "no-cache",
    });
    return {
      error: false,
      data: data?.paginatedMissions,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getInvoices = async (
  access: string,
  skip: number,
  take: number
) => {
  try {
    const { data }: any = await client.query({
      query: INVOICES,
      variables: {
        options: {
          skip,
          take,
          where: {
            search: "",
          },
          sortBy: {
            createdAt: "DESC",
          },
        },
      },
      fetchPolicy: "no-cache",
      context: { accessToken: access },
    });
    return {
      error: false,
      data: data?.freelancerInvoices,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getFreelancerInfo = async (access: string, userId: number) => {
  try {
    const { data }: any = await client.query({
      query: FREELANCER_PROFILE,
      variables: {
        userId,
      },
      context: { accessToken: access },
      fetchPolicy: "no-cache",
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

export const getMissionsStats = async (access: string, timeRange: string) => {
  try {
    const { data }: any = await client.query({
      query: MISSIONS_STATS,
      variables: { timeRange },
      context: { accessToken: access },
    });
    return {
      error: false,
      data: data?.missionStats,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getClientPaginatedOffers = async (
  variables: any,
  accessToken: string
) => {
  try {
    const { data } = await client.query({
      query: GET_PAGINATED_CLIENT_OFFERS,
      variables,
      context: { accessToken },
      fetchPolicy: "no-cache",
    });
    return {
      data: data?.paginatedOffers,
      error: false,
    };
  } catch (error: any) {
    return {
      data: error.message,
      error: true,
    };
  }
};

export const getFreelancersAvailability = async (
  freelancerId: number,
  from: string,
  onlyAvailable: boolean,
  access: string
) => {
  try {
    const { data } = await client.query({
      query: FREELANCERS_AVAILABILITY,
      context: { accessToken: access },
      variables: {
        freelancerId,
        from,
        onlyAvailable,
      },
    });
    return {
      error: false,
      data: data?.freelancerAvailability,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getFreelancerProfile = async (userId: number, access: string) => {
  try {
    const { data } = await client.query({
      query: GET_FREELANCER_PROFILE,
      context: { accessToken: access },
      variables: {
        userId,
      },
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

export const createOffer = async (variables: any, access: string) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_OFFER,
      context: {
        accessToken: access,
      },
      variables,
    });
    return {
      error: false,
      data: data?.createOffer,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const markAsSeen = async (ids: number[] | null, accessToken: string) => {
  try {
    const { data } = await client.mutate({
      mutation: MARK_AS_SEEN,
      context: {
        accessToken,
      },
      variables: { ids },
    });
    return {
      error: false,
      data: data?.markAsSeen,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const getNotifsNumber = async (accessToken: string) => {
  try {
    const { data } = await client.mutate({
      mutation: NUMBER_OF_NOTIFS,
      context: {
        accessToken,
      },
      fetchPolicy: "no-cache",
    });
    return {
      error: false,
      data: data?.numberOfNotification,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const completeHiring = async (missionId: number, access: string) => {
  try {
    const { data } = await client.mutate({
      mutation: COMPLETE_HIRING,
      context: { accessToken: access },
      variables: {
        missionId,
      },
    });
    return {
      error: false,
      data: data?.completeHiring,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const rejectOffer = async (offerId: number, access: string) => {
  try {
    const { data } = await client.mutate({
      mutation: REJECT_OFFER,
      context: { accessToken: access },
      variables: { offerId },
    });
    return {
      error: false,
      data: data?.rejectOffer,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const createFreelancerAvailability = async (
  freelancerId: number,
  date: string,
  type: "NOT_AVAILABLE" | "FULLDAY" | "MORNING" | "EVENING"
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_FREELANCER_AVAILABILITY,
      variables: {
        input: {
          date,
          freelancerId,
          type,
        },
      },
    });
    return {
      error: false,
      data: data?.createFreelancerAvailability,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const deleteFreelancerAvailability = async (
  freelancerId: number,
  availabilityId: number
) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_FREELANCER_AVAILABILITY,
      variables: {
        freelancerId,
        availabilityId,
      },
    });
    return {
      error: false,
      data: data?.createFreelancerAvailability,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const createClientReview = async (
  clientId: number,
  freelancerId: number,
  hiringId: number,
  rating: number,
  review: string,
  access: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_CLIENT_REVIEW,
      context: { accessToken: access },
      variables: {
        input: {
          clientId,
          freelancerId,
          hiringId,
          rating,
          review,
        },
      },
    });
    return {
      error: false,
      data: data?.createFreelancerReview,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};
export const createFreelancerReview = async (
  clientId: number,
  freelancerId: number,
  hiringId: number,
  rating: number,
  review: string,
  access: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_FREELANCER_REVIEW,
      context: { accessToken: access },
      variables: {
        input: {
          clientId,
          freelancerId,
          hiringId,
          rating,
          review,
        },
      },
    });
    return {
      error: false,
      data: data?.createFreelancerReview,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const cancelOffer = async (offerId: number, access: string) => {
  try {
    const { data } = await client.mutate({
      mutation: CANCEL_OFFER,
      context: { accessToken: access },
      variables: { offerId },
    });
    return {
      error: false,
      data: data?.cancelOffer,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const submitInvoice = async (
  access: string,
  id: number,
  receipt: number
) => {
  try {
    const { data } = await client.mutate({
      mutation: SUBMIT_INVOICE,
      context: { accessToken: access },
      variables: {
        input: {
          id,
          receipt,
        },
      },
    });
    return {
      error: false,
      data: data?.submitInvoice,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const acceptOffer = async (offerId: number, access: string) => {
  try {
    const { data } = await client.mutate({
      mutation: ACCEPT_OFFER,
      context: { accessToken: access },
      variables: { offerId },
    });
    return {
      error: false,
      data: data?.acceptOffer,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const acceptMission = async (missionId: number, access: string) => {
  try {
    const { data } = await client.mutate({
      mutation: ACCEPT_MISSION,
      context: { accessToken: access },
      variables: { missionId },
    });
    return {
      error: false,
      data: data?.completeMission,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const createMission = async (hiringId: number, access: string) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_MISSION,
      context: { accessToken: access },
      variables: {
        input: {
          hiringId,
        },
      },
    });
    return {
      error: false,
      data: data?.createMission,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const resetPasswordOtp = async (
  email: number,
  token: string,
  newPassword: string,
  access: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: RESET_PASSWORD_OTP,
      context: { accessToken: access },
      variables: {
        input: {
          email,
          token,
          newPassword,
        },
      },
    });
    return {
      error: false,
      data: data?.resetPasswordWithCode,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const startMission = async (missionId: number, access: string) => {
  try {
    const { data } = await client.mutate({
      mutation: START_MISSION,
      context: { accessToken: access },
      variables: {
        missionId,
      },
    });
    return {
      error: false,
      data: data?.startMission,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const createHiring = async (offerId: number, access: string) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_HIRING,
      context: { accessToken: access },
      variables: {
        input: {
          offerId,
        },
      },
    });
    return {
      error: false,
      data: data?.createHiring,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const linkPromoCodeOffer = async (
  offerId: number,
  promoCodeName: string,
  access: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: LINK_PROMO_OFFER,
      context: { accessToken: access },
      variables: {
        offerId,
        promoCodeName,
      },
    });
    return {
      error: false,
      data: data?.linkPromoCodeToOffer,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const sendOffer = async (offerId: number, access: string) => {
  try {
    const { data } = await client.mutate({
      mutation: SEND_OFFER,
      context: { accessToken: access },
      variables: {
        offerId,
      },
    });
    return {
      error: false,
      data: data?.linkPromoCodeToOffer,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};
