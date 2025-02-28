'use client'

import DebugEnvironment from '../components/DebugEnvironment'

export default function DebugPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Environment Page</h1>
      <DebugEnvironment />
    </div>
  )
}