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

export const ACHIEVEMENT_EARNED_SUBSCRIPTION = gql`
  subscription AchievementEarned($userId: ID, $companyId: ID) {
    achievementEarned(userId: $userId, companyId: $companyId) {
      employeeAchievement {
        id
        earnedAt
      }
      achievement {
        id
        title
        description
        rewardPoints
        rewardExperience
      }
      user {
        id
        fullName
        email
      }
      companyId
    }
  }
`

export const LEVEL_UP_SUBSCRIPTION = gql`
  subscription LevelUp($userId: ID!) {
    levelUp(userId: $userId) {
      user {
        id
        email
        fullName
      }
      oldLevel
      newLevel
      companyId
    }
  }
`

