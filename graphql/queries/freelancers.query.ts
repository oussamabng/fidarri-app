import { gql } from "@apollo/client";

export const TOP_RATING_FREELANCERS = gql`
  query TopRatingFreelancers {
    topRatingFreelancers {
      id
      firstName
      lastName
      profilePictureUrl
      freelancer_type
      phoneNumber
      about
      rating
      address {
        building
        city
        state
        street
        zipCode
      }
    }
  }
`;

export const FREELANCERS = gql`
  query Freelancers($options: FetchFreelancersArgs!) {
    freelancers(options: $options) {
      totalCount
      hasNextPage
      nodes {
        id
        about
        accountStatus
        active
        address {
          building
          city
          createdAt
          deletedAt
          id
          state
          street
          updatedAt
          zipCode
        }
        applicationStatus
        availability {
          date
          createdAt
          updatedAt
          id
          type
        }
        assignments {
          role {
            id
            description
            name
          }
        }
        availabilityHours
        createdAt
        dateOfBirth
        deletedAt
        email
        firstName
        freelancer_type
        lastName
        numberOfMissions
        phoneNumber
        prefersLanguage
        profilePictureUrl
        rating
        role
        username
      }
    }
  }
`;

export const GET_PAGINATED_MISSIONS = gql`
  query PaginatedMissions($options: FetchMissionsArgs!) {
    paginatedMissions(options: $options) {
      hasNextPage
      totalCount
      nodes {
        hiring {
          offer {
            service
            client {
              rating
              lastName
              id
              firstName
              profilePictureUrl
              phoneNumber
              address {
                building
                city
                state
                street
                zipCode
                __typename
              }
              __typename
            }
            home {
              address {
                building
                city
                state
                street
                zipCode
                __typename
              }
              numberOfPieces
              __typename
            }
            date
            freelancer {
              rating
              firstName
              lastName
              id
              profilePictureUrl
              phoneNumber
              address {
                building
                city
                state
                street
                zipCode
                __typename
              }
              __typename
            }
            id
            status
            type
            price {
              price
              total
              id
              discountedPrice
              __typename
            }
            __typename
          }
          id
          status
          hasFreelancerReview
          hasClientReview
          __typename
        }
        id
        startDate
        status
        endDate
        __typename
      }
      __typename
    }
  }
`;

export const FREELANCER_PROFILE = gql`
  query Freelancer($userId: Float!) {
    freelancer(userId: $userId) {
      id
      firstName
      lastName
      email
      profilePictureUrl
      rating
      numberOfMissions
      phoneNumber
      accountStatus
      username
      address {
        state
        city
        zipCode
        street
        building
        id
      }
    }
  }
`;

export const GET_FREELANCERS_AVAILABILITY = gql`
  query PaginatedFreelancerAvailability(
    $freelancerId: Float!
    $options: FetchFreelancerAvailabilityArgs!
  ) {
    paginatedFreelancerAvailability(
      freelancerId: $freelancerId
      options: $options
    ) {
      hasNextPage
      totalCount
      nodes {
        date
        id
        type
        createdAt
      }
    }
  }
`;

export const GET_PAGINATED_CLIENT_OFFERS = gql`
  query PaginatedOffers($options: FetchOffersArgs!) {
    paginatedOffers(options: $options) {
      hasNextPage
      totalCount
      nodes {
        id
        hiring {
          id
        }
        createdAt
        service
        client {
          id
          rating
          createdAt
          firstName
          lastName
          username
          email
          phoneNumber
          role
          active
          profilePictureUrl
          prefersLanguage
          dateOfBirth
          address {
            id
            createdAt
            building
            street
            state
            city
            zipCode
            deletedAt
            __typename
          }
          applicationStatus
          deletedAt
          __typename
        }
        freelancer {
          id
          createdAt
          firstName
          lastName
          username
          email
          phoneNumber
          role
          active
          profilePictureUrl
          prefersLanguage
          dateOfBirth
          address {
            id
            createdAt
            building
            street
            state
            city
            zipCode
            deletedAt
            __typename
          }
          applicationStatus
          deletedAt
          freelancer_type

          rating
          __typename
        }
        home {
          id
          createdAt
          address {
            id
            createdAt
            building
            street
            state
            city
            zipCode
            deletedAt
            __typename
          }
          numberOfPieces
          deletedAt
          __typename
        }
        price {
          total
          price
          id
          discountedPrice
          createdAt
          __typename
        }
        date
        status
        type
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
          __typename
        }
        deletedAt
        __typename
      }
      __typename
    }
  }
`;

export const MISSIONS_STATS = gql`
  query MissionStats($timeRange: TimeRangeEnum) {
    missionStats(timeRange: $timeRange) {
      comission
      numberOfCodes
      numberOfMissions
      revenu
      totalAmount
    }
  }
`;
export const MISSIONS_GRAPH = gql`
  query MissionsGraph($input: MissionGraphInput!) {
    missionsGraph(input: $input) {
      cancelledOffersCount
      completedMissionsCount
      labels
    }
  }
`;

export const INVOICES = gql`
  query FreelancerInvoices($options: FetchInvoicesArgs!) {
    freelancerInvoices(options: $options) {
      hasNextPage
      nodes {
        accumulatedAmount
        createdAt
        dateOfIssue
        deadline
        facturation {
          accumulatedAmount
          amountToPay
          commission
          discountedAmount
          receivedAmount
          totalAmount
        }
        id
        receipt {
          full_url
        }
        status
        missions {
          id
          createdAt
          startDate
          endDate
          hiring {
            offer {
              price {
                total
                price
                discountedPrice
              }
            }
          }
        }
      }
    }
  }
`;

export const NUMBER_OF_NOTIFS_SUB = gql`
  subscription NumberOfNotifications($userId: Float!) {
    numberOfNotifications(userId: $userId) {
      count
      userId
    }
  }
`;

export const NUMBER_OF_NOTIFS = gql`
  query Query {
    numberOfNotification
  }
`;

export const FREELANCERS_AVAILABILITY = gql`
  query FreelancerAvailability(
    $freelancerId: Float!
    $from: DateTime!
    $onlyAvailable: Boolean
  ) {
    freelancerAvailability(
      freelancerId: $freelancerId
      from: $from
      only_available: $onlyAvailable
    ) {
      date
      id
      type
    }
  }
`;

export const GET_FREELANCER_PROFILE = gql`
  query Freelancer($userId: Float!) {
    freelancer(userId: $userId) {
      about
      id
      createdAt
      firstName
      lastName
      username
      email
      phoneNumber
      role
      active
      profilePictureUrl
      prefersLanguage
      dateOfBirth
      address {
        id
        createdAt
        building
        street
        state
        city
        zipCode
        deletedAt
      }
      applicationStatus
      deletedAt

      rating
      freelancer_type
      accountStatus
      assignments {
        role {
          id
          name
          description
        }
      }
      availability {
        id
        type
        date
      }
    }
  }
`;

export const GET_FREELANCER_REVIEWS = gql`
  query PaginatedFreelancerReviews(
    $freelancerId: Float!
    $options: PaginationArgs!
  ) {
    paginatedFreelancerReviews(freelancerId: $freelancerId, options: $options) {
      nodes {
        id
        rating
        review
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
