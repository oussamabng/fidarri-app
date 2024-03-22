import { gql } from "@apollo/client";

export const GET_CLIENT = gql`
  query Client($userId: Float!) {
    client(userId: $userId) {
      email
      firstName
      lastName
      username
      phoneNumber
      rating
      accountStatus
      profilePictureUrl
      address {
        street
      }
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query MyNotifications($options: FetchNotificationsArgs!) {
    myNotifications(options: $options) {
      hasNextPage
      totalCount
      nodes {
        id
        createdAt
        seen
        action
        user {
          username
        }
      }
    }
  }
`;
export const FREELANCER_REVIEWS = gql`
  query PaginatedFreelancerReviews(
    $freelancerId: Float!
    $options: PaginationArgs!
  ) {
    paginatedFreelancerReviews(freelancerId: $freelancerId, options: $options) {
      nodes {
        review
        rating
        id
        createdAt
        client {
          firstName
          lastName
          profilePictureUrl
        }
      }
      hasNextPage
      totalCount
    }
  }
`;
export const CLIENT_REVIEWS = gql`
  query PaginatedClientReviews($clientId: Float!, $options: PaginationArgs!) {
    paginatedClientReviews(clientId: $clientId, options: $options) {
      hasNextPage
      nodes {
        createdAt
        freelancer {
          firstName
          lastName
          profilePictureUrl
        }
        id
        rating
        review
        updatedAt
      }
      totalCount
    }
  }
`;

export const GET_USER = gql`
  query User($userId: Float!) {
    user(id: $userId) {
      applicationStatus
    }
  }
`;
export const GET_FREELANCER = gql`
  query Freelancer($userId: Float!) {
    freelancer(userId: $userId) {
      email
      firstName
      lastName
      username
      phoneNumber
      rating
      accountStatus
      profilePictureUrl
      address {
        street
      }
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateUser($userId: Float!, $input: UpdateUserDto) {
    updateUser(userId: $userId, input: $input) {
      id
    }
  }
`;

export const CHECK_PHONE_AVAILABLE = gql`
  query Query($phoneNumber: String!) {
    checkPhoneNumberAvailability(phoneNumber: $phoneNumber)
  }
`;

export const CHECK_EMAIL_AVAILABLE = gql`
  query Query($email: String!) {
    checkEmailAvailability(email: $email)
  }
`;

export const CHECK_USERNAME_AVAILABLE = gql`
  query Query($username: String!) {
    checkUsernameAvailability(username: $username)
  }
`;

export const OFFICES_AVAILABILITY = gql`
  query OfficesAvailability($from: DateTime) {
    officesAvailability(from: $from) {
      id
      date
      office {
        id
        name
      }
    }
  }
`;
