import { gql } from "@apollo/client";

export const CREATE_OFFER = gql`
  mutation CreateOffer($input: CreateOfferInput!) {
    createOffer(input: $input) {
      id
      price {
        id
        createdAt
        price
        discountedPrice
        total
      }
      promoCode {
        id
        createdAt
        code
        discount
        discountPercentage
        type
        usageLimit
        usedTimes
        startDate
        endDate
      }
      status
    }
  }
`;

export const LINK_PROMO_OFFER = gql`
  mutation LinkPromoCodeToOffer($offerId: Float!, $promoCodeName: String!) {
    linkPromoCodeToOffer(offerId: $offerId, promoCodeName: $promoCodeName) {
      price {
        price
        total
        discountedPrice
      }
    }
  }
`;

export const RESET_PASSWORD_OTP = gql`
  mutation ResetPasswordWithCode($input: ResetPasswordInput!) {
    resetPasswordWithCode(input: $input) {
      message
    }
  }
`;

export const SEND_OFFER = gql`
  mutation SendOffer($offerId: Float!) {
    sendOffer(offerId: $offerId) {
      id
    }
  }
`;

export const REJECT_OFFER = gql`
  mutation RejectOffer($offerId: Float!) {
    rejectOffer(offerId: $offerId) {
      id
    }
  }
`;

export const CANCEL_OFFER = gql`
  mutation CancelOffer($offerId: Float!) {
    cancelOffer(offerId: $offerId) {
      id
    }
  }
`;

export const SUBMIT_INVOICE = gql`
  mutation SubmitInvoice($input: SubmitInvoiceInput!) {
    submitInvoice(input: $input) {
      id
    }
  }
`;

export const DELETE_FREELANCER_AVAILABILITY = gql`
  mutation DeleteFreelancerAvailability(
    $freelancerId: Float!
    $availabilityId: Float!
  ) {
    deleteFreelancerAvailability(
      freelancerId: $freelancerId
      availabilityId: $availabilityId
    ) {
      deletedAt
    }
  }
`;

export const CREATE_FREELANCER_AVAILABILITY = gql`
  mutation CreateFreelancerAvailability(
    $input: CreateFreelancerAvailabilityInput!
  ) {
    createFreelancerAvailability(input: $input) {
      id
    }
  }
`;

export const CREATE_CLIENT_REVIEW = gql`
  mutation CreateFreelancerReview($input: CreateReviewInput!) {
    createFreelancerReview(input: $input) {
      id
    }
  }
`;
export const CREATE_FREELANCER_REVIEW = gql`
  mutation CreateFreelancerReview($input: CreateReviewInput!) {
    createFreelancerReview(input: $input) {
      id
    }
  }
`;

export const MARK_AS_SEEN = gql`
  mutation MarkAsSeen($ids: [Float!]) {
    markAsSeen(ids: $ids) {
      id
    }
  }
`;

export const ACCEPT_OFFER = gql`
  mutation AcceptOffer($offerId: Float!) {
    acceptOffer(offerId: $offerId) {
      id
    }
  }
`;

export const REJECT_MISSION = gql`
  mutation RejectOffer($offerId: Float!) {
    rejectOffer(offerId: $offerId) {
      id
    }
  }
`;

export const COMPLETE_HIRING = gql`
  mutation CompleteHiring($missionId: Float!) {
    completeHiring(missionId: $missionId) {
      id
    }
  }
`;

export const ACCEPT_MISSION = gql`
  mutation CompleteMission($missionId: Float!) {
    completeMission(missionId: $missionId) {
      id
    }
  }
`;

export const START_MISSION = gql`
  mutation StartMission($missionId: Float!) {
    startMission(missionId: $missionId) {
      createdAt
      endDate
      id
      startDate
      status
    }
  }
`;

export const CREATE_HIRING = gql`
  mutation CreateHiring($input: CreateHiringInput!) {
    createHiring(input: $input) {
      id
    }
  }
`;

export const CREATE_MISSION = gql`
  mutation CreateMission($input: CreateMissionInput!) {
    createMission(input: $input) {
      id
    }
  }
`;
