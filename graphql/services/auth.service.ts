import {
  LOGIN,
  REGISTER_CLIENT,
  REGISTER_FREELANCER,
  REFRESH_TOKEN,
  CREATE_MEET,
  CREATE_IDENTIFICATION,
  VERIFY_OTP,
  RESEND_OTP,
  UPDATE_PASSWORD,
  REQUEST_RESET_PASSWORD,
  RESET_PASSWORD,
  LOGOUT,
} from "@/graphql/mutations/auth.mutation";
import client from "@/graphql/config";
import {
  CHECK_EMAIL_AVAILABLE,
  CHECK_PHONE_AVAILABLE,
  CHECK_USERNAME_AVAILABLE,
} from "../queries/profile.query";

interface LoginProps {
  email: string;
  password: string;
}

export const login = async (
  variables: LoginProps,
  deviceToken: string | null
) => {
  try {
    const { data } = await client.mutate({
      mutation: LOGIN,
      variables: {
        credentials: variables,
      },
      context: {
        deviceToken,
      },
    });
    return {
      error: false,
      data: data?.login,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const logoutUser = async (
  accessToken: string,
  deviceToken: string | null
) => {
  try {
    const { data } = await client.mutate({
      mutation: LOGOUT,
      context: {
        accessToken,
        deviceToken,
      },
    });
    return {
      error: false,
      data: data?.logout,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const createMeet = async (date: string, freelancerId: number) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_MEET,
      variables: {
        input: {
          date,
          freelancerId,
        },
      },
    });
    return {
      error: false,
      data: data?.createMeeting,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const registerClient = async (
  variables: any,
  deviceToken: string | null
) => {
  try {
    const { data } = await client.mutate({
      mutation: REGISTER_CLIENT,
      variables: {
        where: variables,
      },
      context: { deviceToken },
    });
    return {
      error: false,
      data: data?.registerClient,
    };
  } catch (error: any) {
    console.log("error", error);
    return {
      error: true,
      data: error.message,
    };
  }
};

export const registerFreelancer = async (
  variables: any,
  deviceToken: string | null
) => {
  try {
    const { data } = await client.mutate({
      mutation: REGISTER_FREELANCER,
      variables: {
        where: variables,
      },
      context: { deviceToken },
    });
    return {
      error: false,
      data: data?.registerFreelancer,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const verifyOtp = async (
  userEmail: string,
  code: string,
  deviceToken: string
) => {
  try {
    const { data } = await client.mutate({
      mutation: VERIFY_OTP,
      variables: {
        userEmail,
        code,
      },
      context: { deviceToken },
    });
    return {
      error: false,
      data: data?.verifyOtpCode,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const requestResetPassword = async (email: string) => {
  try {
    const { data } = await client.mutate({
      mutation: REQUEST_RESET_PASSWORD,
      variables: {
        input: { email },
      },
    });
    return {
      error: false,
      data: data?.requestResetPassword,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const resetPassword = async (newPassword: string, token: string) => {
  try {
    const { data } = await client.mutate({
      mutation: RESET_PASSWORD,
      variables: {
        input: { newPassword, token },
      },
    });
    return {
      error: false,
      data: data?.resetPassword,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const updatePassword = async (
  oldPassword: string,
  newPassword: string,
  access: string
) => {
  console.log("old");
  console.log(oldPassword);

  console.log("new");
  console.log(newPassword);
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PASSWORD,
      variables: {
        input: {
          newPassword: newPassword,
          oldPassword: oldPassword,
        },
      },
      context: { accessToken: access },
    });
    return {
      error: false,
      data: data?.updatePassword,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const resendOtp = async (email: string) => {
  try {
    const { data } = await client.mutate({
      mutation: RESEND_OTP,
      variables: {
        email,
      },
    });
    return {
      error: false,
      data: data?.resendActivationCode,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const refreshToken = async (variables: { refreshToken: string }) => {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables,
    });
    return {
      error: false,
      data: data?.refreshAccessToken,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const checkPhoneNumberAvailability = async (phoneNumber: string) => {
  try {
    const { data } = await client.query({
      query: CHECK_PHONE_AVAILABLE,
      variables: {
        phoneNumber,
      },
    });
    return {
      error: false,
      data: data?.checkPhoneNumberAvailability,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const checkEmailAvailability = async (email: string) => {
  try {
    const { data } = await client.query({
      query: CHECK_EMAIL_AVAILABLE,
      variables: {
        email,
      },
      fetchPolicy: "no-cache",
    });
    return {
      error: false,
      data: data?.checkEmailAvailability,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const checkUsernameAvailability = async (username: string) => {
  try {
    const { data } = await client.query({
      query: CHECK_USERNAME_AVAILABLE,
      variables: {
        username,
      },
    });
    return {
      error: false,
      data: data?.checkUsernameAvailability,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};

export const createIdentification = async (
  documentId: number,
  userId: number
) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_IDENTIFICATION,
      variables: {
        input: {
          documentId,
          userId,
        },
      },
    });
    return {
      error: false,
      data: data?.createUserIdentification,
    };
  } catch (error: any) {
    return {
      error: true,
      data: error.message,
    };
  }
};
