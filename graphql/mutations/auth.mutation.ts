import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($credentials: LoginDto!) {
    login(credentials: $credentials) {
      access
      refresh
    }
  }
`;

export const LOGOUT = gql`
  mutation Mutation {
    logout
  }
`;

export const REGISTER_CLIENT = gql`
  mutation RegisterClient($where: RegisterDto!) {
    registerClient(where: $where) {
      id
      email
    }
  }
`;
export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input) {
      message
    }
  }
`;
export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      message
    }
  }
`;
export const REQUEST_RESET_PASSWORD = gql`
  mutation RequestResetPassword($input: RequestResetPasswordInput!) {
    requestResetPassword(input: $input) {
      email
      message
    }
  }
`;

export const RESEND_OTP = gql`
  mutation ResendActivationCode($email: String!) {
    resendActivationCode(email: $email)
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOtpCode($userEmail: String!, $code: String!) {
    verifyOtpCode(userEmail: $userEmail, code: $code) {
      access
      refresh
    }
  }
`;
export const CREATE_IDENTIFICATION = gql`
  mutation CreateUserIdentification($input: CreateIdentificationInput!) {
    createUserIdentification(input: $input) {
      id
      status
      document {
        full_url
      }
    } 
  }
`;

export const CREATE_MEET = gql`
  mutation CreateMeeting($input: CreateMeetingInput!) {
    createMeeting(input: $input) {
      date
      id
      status
    }
  }
`;

export const REGISTER_FREELANCER = gql`
  mutation RegisterFreelancer($where: RegisterDto!) {
    registerFreelancer(where: $where) {
      id
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken) {
      access
      refresh
    }
  }
`;
