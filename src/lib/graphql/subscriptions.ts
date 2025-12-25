import { gql } from '@apollo/client'

export const WASTE_PHOTO_STATUS_SUBSCRIPTION = gql`
  subscription WastePhotoStatusUpdated($wastePhotoId: ID) {
    wastePhotoStatusUpdated(wastePhotoId: $wastePhotoId) {
      id
      status
      recommendedBinType
      aiExplanation
      image {
        id
        url
      }
      company {
        id
        name
      }
      collectionArea {
        id
        name
        bins {
          id
          type
        }
      }
      createdAt
      updatedAt
    }
  }
`

