import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../utils/test-utils'
import userEvent from '@testing-library/user-event'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import i18n from '@/i18n/config'

describe('LanguageSwitcher Component', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('ru')
  })

  it('should render current language', () => {
    render(<LanguageSwitcher />)
    expect(screen.getByText('RU')).toBeInTheDocument()
  })

  it('should toggle language on click', async () => {
    const changeLanguageSpy = vi.spyOn(i18n, 'changeLanguage')
    const user = userEvent.setup()
    
    render(<LanguageSwitcher />)
    const button = screen.getByRole('button')
    
    await user.click(button)
    expect(changeLanguageSpy).toHaveBeenCalledWith('en')
    
    changeLanguageSpy.mockRestore()
  })

  it('should show EN when language is English', async () => {
    await i18n.changeLanguage('en')
    render(<LanguageSwitcher />)
    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  it('should have correct title attribute', () => {
    render(<LanguageSwitcher />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('title', 'Switch to English')
  })
})

