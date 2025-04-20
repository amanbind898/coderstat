// tests/integration/question-tracker.test.js
import { render, screen } from '@testing-library/react'
import QuestionTrackerPage from '@/app/question-tracker/page'

test('marks question as solved', async () => {
  // Mock questions data
  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      json: () => ([
        { id: 1, title: 'Two Sum', difficulty: 'Easy' }
      ])
    })

  render(<QuestionTrackerPage />)
  
  // Find and interact with question
  const question = await screen.findByText('Two Sum')
  const statusButton = screen.getByLabelText('Mark as solved')
  
  userEvent.click(statusButton)
  
  // Verify update API call
  expect(fetch).toHaveBeenCalledWith('/api/questions/update', {
    method: 'POST',
    body: JSON.stringify({
      questionId: 1,
      status: 'solved'
    })
  })
})
