import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../utils/test-utils'
import userEvent from '@testing-library/user-event'
import Button from '@/components/ui/Button'

describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByText('Disabled Button')
    expect(button).toBeDisabled()
  })

  it('should show loading state', () => {
    render(<Button isLoading>Button</Button>)
    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
  })

  it('should apply variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    let button = screen.getByText('Primary')
    expect(button.className).toContain('from-green-500')

    rerender(<Button variant="secondary">Secondary</Button>)
    button = screen.getByText('Secondary')
    expect(button.className).toContain('bg-gray-200')

    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByText('Outline')
    expect(button.className).toContain('border-green-500')

    rerender(<Button variant="ghost">Ghost</Button>)
    button = screen.getByText('Ghost')
    expect(button.className).toContain('hover:bg-gray-100')
  })

  it('should apply size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByText('Small')
    expect(button.className).toContain('text-sm')

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByText('Large')
    expect(button.className).toContain('text-lg')
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick} disabled>Disabled</Button>)
    
    await user.click(screen.getByText('Disabled'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should not call onClick when loading', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick} isLoading>Loading</Button>)
    
    await user.click(screen.getByText('Загрузка...'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})

