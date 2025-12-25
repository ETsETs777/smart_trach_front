import { gql } from '@apollo/client'

export const UPLOAD_IMAGE = gql`
  mutation UploadImage($file: Upload!) {
    uploadImage(file: $file) {
      id
      url
      name
    }
  }
`

export const REGISTER_ADMIN = gql`
  mutation RegisterAdmin($input: AdminRegisterInput!) {
    registerAdmin(input: $input) {
      id
      email
      fullName
      role
      isEmailConfirmed
      createdCompanies {
        id
        name
      }
    }
  }
`

export const REGISTER_EMPLOYEE = gql`
  mutation RegisterEmployee($input: EmployeeRegisterInput!) {
    registerEmployee(input: $input) {
      id
      email
      fullName
      role
      isEmailConfirmed
      employeeCompanies {
        id
        name
      }
    }
  }
`

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      id
      email
      fullName
      role
      jwtToken
      isEmailConfirmed
      createdCompanies {
        id
        name
        logo {
          id
          url
        }
      }
      employeeCompanies {
        id
        name
        logo {
          id
          url
        }
      }
    }
  }
`

export const CONFIRM_EMAIL = gql`
  mutation ConfirmEmail($input: ConfirmEmailInput!) {
    confirmEmail(input: $input) {
      id
      email
      fullName
      role
      isEmailConfirmed
      jwtToken
    }
  }
`

export const CREATE_COLLECTION_AREA = gql`
  mutation CreateCollectionArea($input: CollectionAreaCreateInput!) {
    createCollectionArea(input: $input) {
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
    }
  }
`

export const UPDATE_COLLECTION_AREA = gql`
  mutation UpdateCollectionArea($input: CollectionAreaUpdateInput!) {
    updateCollectionArea(input: $input) {
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

export const DELETE_COLLECTION_AREA = gql`
  mutation DeleteCollectionArea($id: ID!) {
    deleteCollectionArea(id: $id)
  }
`

export const ADD_BINS_TO_COLLECTION_AREA = gql`
  mutation AddBinsToCollectionArea($input: CollectionAreaBinsAddInput!) {
    addBinsToCollectionArea(input: $input) {
      id
      type
      latitude
      longitude
      area {
        id
        name
      }
    }
  }
`

export const UPDATE_COLLECTION_AREA_BIN = gql`
  mutation UpdateCollectionAreaBin($input: CollectionAreaBinUpdateInput!) {
    updateCollectionAreaBin(input: $input) {
      id
      type
      latitude
      longitude
    }
  }
`

export const DELETE_COLLECTION_AREA_BIN = gql`
  mutation DeleteCollectionAreaBin($id: ID!) {
    deleteCollectionAreaBin(id: $id)
  }
`

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: EmployeeCreateInput!) {
    createEmployee(input: $input) {
      id
      email
      fullName
      isEmailConfirmed
      isEmployeeConfirmed
    }
  }
`

export const CONFIRM_EMPLOYEE = gql`
  mutation ConfirmEmployee($input: EmployeeConfirmInput!) {
    confirmEmployee(input: $input) {
      id
      isEmployeeConfirmed
    }
  }
`

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($input: UserUpdateEmployeeInput!) {
    updateEmployee(input: $input) {
      id
      fullName
      isActive
    }
  }
`

export const REMOVE_EMPLOYEE_FROM_COMPANY = gql`
  mutation RemoveEmployeeFromCompany($input: UserRemoveFromCompanyInput!) {
    removeEmployeeFromCompany(input: $input)
  }
`

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($input: CompanyUpdateInput!) {
    updateCompany(input: $input) {
      id
      name
      description
      logo {
        id
        url
      }
    }
  }
`

export const CREATE_ACHIEVEMENT = gql`
  mutation CreateAchievement($input: AchievementCreateInput!) {
    createAchievement(input: $input) {
      id
      title
      description
      criterionType
      threshold
    }
  }
`

export const UPDATE_SELF = gql`
  mutation UpdateSelf($input: UserUpdateInput!) {
    updateSelf(input: $input) {
      id
      fullName
      logo {
        id
        url
      }
    }
  }
`

export const UPDATE_ACHIEVEMENT = gql`
  mutation UpdateAchievement($id: ID!, $title: String, $description: String, $threshold: Int) {
    updateAchievement(id: $id, title: $title, description: $description, threshold: $threshold) {
      id
      title
      description
      threshold
      criterionType
    }
  }
`

export const DELETE_ACHIEVEMENT = gql`
  mutation DeleteAchievement($id: ID!) {
    deleteAchievement(id: $id)
  }
`
