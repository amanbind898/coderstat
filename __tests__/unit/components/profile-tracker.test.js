// tests/unit/components/profile-tracker.test.js
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from '@/app/profile-tracker/page'
import { useUser } from '@clerk/nextjs'

// Mock Clerk authentication
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}))

// Mock API calls
global.fetch = jest.fn()

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
  ToastContainer: () => <div />,
}))

describe('Profile Tracker Dashboard', () => {
  const mockUser = {
    id: 'user_123',
    primaryEmailAddress: { emailAddress: 'test@coderstat.com' },
  }

  beforeEach(() => {
    useUser.mockReturnValue({ user: mockUser, isLoaded: true })
  })

  test('renders loading skeleton initially', async () => {
    render(<Dashboard />)
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  test('displays user profile and stats after loading', async () => {
    // Mock API responses
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => ({
        profile: {
          clerkId: 'user_123',
          leetCode: 'test_leetcode',
          isPublic: true,
        },
        isNew: false,
      }),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => ({
        userStats: {
          leetcodeStats: { solved: 150, easy: 50, medium: 70, hard: 30 },
          codechefStats: { rating: 1800 },
        },
      }),
    })

    await act(async () => {
      render(<Dashboard />)
    })

    await waitFor(() => {
      expect(screen.getByText('test_leetcode')).toBeInTheDocument()
      expect(screen.getByText('Total Solved: 150')).toBeInTheDocument()
      expect(screen.getByText('1800')).toBeInTheDocument()
    })
  })

  test('handles profile refresh button click', async () => {
    fetch.mockResolvedValue({ ok: true })
    
    render(<Dashboard />)
    
    await userEvent.click(await screen.findByText('Refresh Coding Stats'))
    
    expect(fetch).toHaveBeenCalledWith('/api/updatePlatformStats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkId: 'user_123',
        leetCode: 'test_leetcode',
        geeksforgeeks: undefined,
        codeforces: undefined,
        codechef: undefined
      }),
    })
  })

  test('toggles profile visibility', async () => {
    fetch.mockResolvedValue({ ok: true })
    
    render(<Dashboard />)
    
    const toggle = await screen.findByRole('checkbox')
    await userEvent.click(toggle)
    
    expect(fetch).toHaveBeenCalledWith('/api/toggle-profile-visibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkId: 'user_123',
        isPublic: false
      }),
    })
  })

  test('handles profile sharing', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })
    
    render(<Dashboard />)
    
    const shareButton = await screen.findByText('Share Profile')
    await userEvent.click(shareButton)
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'http://localhost/profile/user_123'
    )
  })

  test('shows error toast on API failure', async () => {
    fetch.mockRejectedValue(new Error('API Error'))
    
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to fetch profile data. Please try again later.'
      )
    })
  })
})
