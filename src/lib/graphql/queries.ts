import { gql } from '@apollo/client'

export const CREATE_WASTE_PHOTO = gql`
  mutation CreateWastePhoto($input: WastePhotoCreateInput!) {
    createWastePhoto(input: $input) {
      id
      status
      image {
        id
        url
      }
      company {
        id
        name
      }
    }
  }
`

export const GET_WASTE_PHOTO = gql`
  query GetWastePhoto($id: ID!) {
    wastePhoto(id: $id) {
      id
      status
      recommendedBinType
      aiExplanation
      image {
        id
        url
        name
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

export const GET_COLLECTION_AREAS = gql`
  query GetCollectionAreas($companyId: ID!) {
    collectionAreas(companyId: $companyId) {
      id
      name
      description
      bins {
        id
        type
      }
    }
  }
`

export const GET_COMPANY_ANALYTICS = gql`
  query GetCompanyAnalytics($companyId: String!, $dateFrom: DateTime, $dateTo: DateTime) {
    companyAnalytics(companyId: $companyId, dateFrom: $dateFrom, dateTo: $dateTo) {
      companyId
      binUsage {
        binType
        count
      }
      leaderboard {
        employee {
          id
          fullName
          email
        }
        totalClassifiedPhotos
      }
      hallOfFame {
        employee {
          id
          fullName
          email
        }
        totalClassifiedPhotos
      }
      areas {
        area {
          id
          name
        }
        totalPhotos
      }
      dateFrom
      dateTo
    }
  }
`

export const GET_COLLECTION_AREA = gql`
  query GetCollectionArea($id: ID!) {
    collectionArea(id: $id) {
      id
      name
      description
      bins {
        id
        type
      }
      company {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
      description
      isActive
      logo {
        id
        url
      }
      createdAt
    }
  }
`

export const GET_COMPANY = gql`
  query GetCompany($id: ID!) {
    company(id: $id) {
      id
      name
      description
      isActive
      logo {
        id
        url
      }
      qrCode
      createdAt
      updatedAt
    }
  }
`

export const GET_COMPANY_EMPLOYEES = gql`
  query GetCompanyEmployees($companyId: ID!) {
    companyEmployees(companyId: $companyId) {
      id
      email
      fullName
      role
      isActive
      isEmailConfirmed
      isEmployeeConfirmed
      logo {
        id
        url
      }
      createdAt
    }
  }
`

export const GET_COMPANY_ACHIEVEMENTS = gql`
  query GetCompanyAchievements($companyId: ID!) {
    companyAchievements(companyId: $companyId) {
      id
      title
      description
      criterionType
      threshold
      createdAt
      updatedAt
    }
  }
`

export const GET_COMPANY_LEADERBOARD = gql`
  query GetCompanyLeaderboard($companyId: String!) {
    companyAnalytics(companyId: $companyId) {
      leaderboard {
        employee {
          id
          fullName
          email
        }
        totalClassifiedPhotos
      }
    }
  }
`

export const GET_ME = gql`
  query Me {
    me {
      id
      email
      fullName
      role
      logo {
        id
        url
      }
      employeeCompanies {
        id
        name
      }
      createdCompanies {
        id
        name
      }
    }
  }
`

export const GET_WASTE_PHOTOS = gql`
  query GetWastePhotos($companyId: ID!, $userId: ID, $skip: Int, $take: Int, $dateFrom: DateTime, $dateTo: DateTime) {
    wastePhotos(companyId: $companyId, userId: $userId, skip: $skip, take: $take, dateFrom: $dateFrom, dateTo: $dateTo) {
      id
      status
      recommendedBinType
      aiExplanation
      createdAt
      image {
        id
        url
      }
      collectionArea {
        id
        name
      }
    }
  }
`

export const GET_COLLECTION_AREA_BINS = gql`
  query GetCollectionAreaBins($areaId: ID!) {
    collectionAreaBins(areaId: $areaId) {
      id
      type
      area {
        id
        name
      }
    }
  }
`

