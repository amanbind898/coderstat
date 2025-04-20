// tests/integration/event-tracker.test.js
import { render, screen } from '@testing-library/react'
import EventTrackerPage from '@/app/event-tracker/page'

test('displays upcoming contests', async () => {
  // Mock CList API response
  global.fetch = jest.fn().mockResolvedValue({
    json: () => ({
      objects: [{
        event: 'LeetCode Biweekly',
        start: '2025-05-01T15:00:00',
        href: 'https://leetcode.com/contest'
      }]
    })
  })

  render(<EventTrackerPage />)
  
  // Verify contest display
  const contest = await screen.findByText('LeetCode Biweekly')
  const reminderButton = screen.getByLabelText('Set reminder')
  
  // Test reminder setting
  userEvent.click(reminderButton)
  expect(localStorage.getItem('contestReminders')).toContain('LeetCode Biweekly')
})
