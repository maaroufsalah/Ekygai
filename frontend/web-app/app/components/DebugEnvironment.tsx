'use client'

import { useEffect, useState } from 'react'
import { getApiUrl, publicApiUrl, serverApiUrl } from '../lib/apiConfig'

export default function DebugEnvironment() {
  const [clientApiUrl, setClientApiUrl] = useState<string>('')
  const [envVariables, setEnvVariables] = useState<any>({})
  const [apiHealthStatus, setApiHealthStatus] = useState<string>('Checking...')

  useEffect(() => {
    // This will run on the client side
    setClientApiUrl(getApiUrl())
    
    // Check what environment variables are available in the browser
    setEnvVariables({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      // Only NEXT_PUBLIC_* variables are available in the browser
    })
    
    // Test API connectivity
    const testApiConnection = async () => {
      try {
        const apiUrl = getApiUrl()
        console.log('Testing API connection to:', apiUrl)
        
        // First test a simple health endpoint (if available)
        try {
          const healthResponse = await fetch(`${apiUrl}health`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          })
          console.log('Health endpoint status:', healthResponse.status)
          setApiHealthStatus(`Health endpoint: ${healthResponse.status}`)
        } catch (healthError: any) {
          console.error('Health endpoint error:', healthError)
          setApiHealthStatus(`Health endpoint error: ${healthError.message}`)
        }
        
        // Test the auth endpoints that were failing
        try {
          const response = await fetch(`${apiUrl}auth/register`, { 
            method: 'OPTIONS',
            headers: { 'Content-Type': 'application/json' }
          })
          console.log('Auth endpoint OPTIONS status:', response.status)
        } catch (authError) {
          console.error('Auth endpoint error:', authError)
        }
      } catch (error: any) {
        console.error('API connection test failed:', error)
        setApiHealthStatus(`Connection failed: ${error.message}`)
      }
    }
    
    testApiConnection()
  }, [])

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Environment Debug Info</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold">API URLs:</h3>
        <p><strong>Client-side getApiUrl():</strong> {clientApiUrl}</p>
        <p><strong>publicApiUrl constant:</strong> {publicApiUrl}</p>
        <p><strong>serverApiUrl constant:</strong> {serverApiUrl}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold">API Connection Test:</h3>
        <p><strong>Status:</strong> {apiHealthStatus}</p>
        <p className="text-sm text-gray-500">Check browser console for more details</p>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold">Environment Variables (client-side):</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(envVariables, null, 2)}
        </pre>
      </div>
      
      <div className="mt-4">
        <h3 className="font-semibold">Manual Tests:</h3>
        <button 
          onClick={() => window.open(`${clientApiUrl}health`, '_blank')}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Test Health Endpoint
        </button>
        <button 
          onClick={() => window.open(`${clientApiUrl}auth/register`, '_blank')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test Auth Endpoint
        </button>
      </div>
    </div>
  )
}