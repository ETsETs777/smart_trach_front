import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../utils/test-utils'
import { MockedProvider } from '@apollo/client/testing'
import AdminDashboard from '@/pages/AdminDashboard'
import { GET_COMPANY_ANALYTICS, GET_COMPANY } from '@/lib/graphql/queries'
import { useWasteStore } from '@/store/useWasteStore'

// Мок для useWasteStore
vi.mock('@/store/useWasteStore', () => ({
  useWasteStore: vi.fn(),
}))

const mockCompanyId = 'test-company-id'

const mockAnalytics = {
  request: {
    query: GET_COMPANY_ANALYTICS,
    variables: { companyId: mockCompanyId },
  },
  result: {
    data: {
      companyAnalytics: {
        companyId: mockCompanyId,
        binUsage: [
          { binType: 'PLASTIC', count: 10 },
          { binType: 'PAPER', count: 5 },
        ],
        leaderboard: [
          {
            employee: {
              id: '1',
              fullName: 'John Doe',
              email: 'john@example.com',
            },
            totalClassifiedPhotos: 15,
          },
        ],
        areas: [
          { id: '1', name: 'Area 1', totalPhotos: 10 },
          { id: '2', name: 'Area 2', totalPhotos: 5 },
        ],
      },
    },
  },
}

const mockCompany = {
  request: {
    query: GET_COMPANY,
    variables: { id: mockCompanyId },
  },
  result: {
    data: {
      company: {
        id: mockCompanyId,
        name: 'Test Company',
        description: 'Test Description',
        logo: {
          id: 'logo-id',
          url: 'https://example.com/logo.png',
        },
      },
    },
  },
}

describe('AdminDashboard Integration Test', () => {
  beforeEach(() => {
    vi.mocked(useWasteStore).mockReturnValue({
      companyId: mockCompanyId,
      setCompanyId: vi.fn(),
    } as any)
  })

  it('should render dashboard with analytics data', async () => {
    render(
      <MockedProvider mocks={[mockAnalytics, mockCompany]}>
        <AdminDashboard />
      </MockedProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByText(/панель администратора/i)).toBeInTheDocument()
    })
    
    await waitFor(() => {
      expect(screen.getByText(/всего сортировок/i)).toBeInTheDocument()
    })
  })

  it('should display company logo when available', async () => {
    render(
      <MockedProvider mocks={[mockAnalytics, mockCompany]}>
        <AdminDashboard />
      </MockedProvider>
    )
    
    await waitFor(() => {
      const logo = screen.getByAltText(/логотип компании/i)
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', 'https://example.com/logo.png')
    })
  })

  it('should display navigation cards', async () => {
    render(
      <MockedProvider mocks={[mockAnalytics, mockCompany]}>
        <AdminDashboard />
      </MockedProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByText(/области сбора/i)).toBeInTheDocument()
      expect(screen.getByText(/сотрудники/i)).toBeInTheDocument()
      expect(screen.getByText(/настройки/i)).toBeInTheDocument()
    })
  })

  it('should display footer links', async () => {
    render(
      <MockedProvider mocks={[mockAnalytics, mockCompany]}>
        <AdminDashboard />
      </MockedProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByText(/документация/i)).toBeInTheDocument()
      expect(screen.getByText(/помощь/i)).toBeInTheDocument()
    })
  })
})

