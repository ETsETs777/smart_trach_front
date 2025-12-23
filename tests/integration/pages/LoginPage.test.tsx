import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../utils/test-utils'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/pages/LoginPage'
import { MockedProvider } from '@apollo/client/testing'
import { LOGIN } from '@/lib/graphql/mutations'

// Мок для react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  }
})

describe('LoginPage Integration Test', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    localStorage.clear()
  })

  it('should render login form', () => {
    render(
      <MockedProvider mocks={[]}>
        <LoginPage />
      </MockedProvider>
    )
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(
      <MockedProvider mocks={[]}>
        <LoginPage />
      </MockedProvider>
    )
    
    const submitButton = screen.getByRole('button', { name: /войти/i })
    await user.click(submitButton)
    
    // React Hook Form должен показать ошибки валидации
    await waitFor(() => {
      expect(screen.getByText(/обязательно/i)).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    const loginMutation = {
      request: {
        query: LOGIN,
        variables: {
          input: {
            email: 'test@example.com',
            password: 'password123',
          },
        },
      },
      result: {
        data: {
          login: {
            id: '1',
            email: 'test@example.com',
            fullName: 'Test User',
            role: 'ADMIN_COMPANY',
            jwtToken: 'mock-token',
            isEmailConfirmed: true,
            createdCompanies: [],
            employeeCompanies: [],
          },
        },
      },
    }

    const user = userEvent.setup()
    render(
      <MockedProvider mocks={[loginMutation]}>
        <LoginPage />
      </MockedProvider>
    )
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /войти/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'mock-token')
    })
  })
})

