import { getAuth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

export function requireAuth(req: NextRequest) {
  const { userId } = getAuth(req)
  if (!userId) {
    throw new Error('Unauthorized')
  }
  return userId
}
