// tests/integration/admin-upload.test.js
import { render, screen } from '@testing-library/react'
import UploadPage from '@/app/upload/page'

test('admin CSV upload process', async () => {
  // Mock admin user
  jest.mock('@clerk/nextjs', () => ({
    useUser: () => ({ isAdmin: true })
  }))

  // Create test file
  const file = new File(['id,title,difficulty\n1,Two Sum,Easy'], 'questions.csv', {
    type: 'text/csv'
  })

  render(<UploadPage />)
  
  // Upload file
  const input = screen.getByLabelText('Upload CSV')
  await userEvent.upload(input, file)
  
  // Verify processing
  await screen.findByText('Processing 1 questions...')
  
  // Verify API call
  expect(fetch).toHaveBeenCalledWith('/api/questions/import', {
    method: 'POST',
    body: expect.any(FormData)
  })
})
