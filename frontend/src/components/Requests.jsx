import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests, removeRequest } from "../utils/requestSlice"
import { useEffect, useState } from 'react'

const Requests = () => {
  const requests = useSelector((store) => store.requests) || []
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const dispatch = useDispatch()

  const fetchRequest = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true
      })
      
      // Ensure we have valid data before dispatching
      if (res.data && res.data.data) {
        dispatch(addRequests(res.data.data))
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      setError('Failed to load requests. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reviewRequest = async (status, _id) => {
    if (!_id) {
      console.error('No request ID provided')
      return
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`, 
        {}, 
        { withCredentials: true }
      )
      
      // Only remove from store if API call was successful
      if (res.status === 200 || res.status === 201) {
        dispatch(removeRequest(_id))
      }
    } catch (error) {
      console.error('Error reviewing request:', error)
      setError(`Failed to ${status} request. Please try again.`)
    }
  }

  useEffect(() => {
    fetchRequest()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl text-gray-400">Loading requests...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl mb-6">⚠️</div>
          <h1 className="text-4xl font-bold text-white mb-4">Oops!</h1>
          <p className="text-xl text-gray-400 mb-8">{error}</p>
          <button 
            onClick={fetchRequest}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // No requests state
  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl mb-6">📨</div>
          <h1 className="text-4xl font-bold text-white mb-4">No Requests Yet</h1>
          <p className="text-xl text-gray-400 mb-8">People will send you connection requests here!</p>
          <div className="w-32 h-1 bg-white mx-auto rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Connection Requests
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            You have {requests.length} pending request{requests.length !== 1 ? 's' : ''}
          </p>
          <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6">
          {requests.map((request, index) => {
            // Handle case where request might not have fromUserId
            if (!request.fromUserId) {
              console.warn('Request missing fromUserId:', request)
              return null
            }

            const { _id, firstName, lastName, photoUrl, age, gender, about } = request.fromUserId
            const requestId = request._id || `request-${index}`

            return (
              <div 
                key={requestId}
                className="group bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-900/50"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img 
                        src={photoUrl || `https://via.placeholder.com/96x96/374151/ffffff?text=${(firstName?.[0] || "U")}`} 
                        alt={`${firstName || "User"} ${lastName || ""}`} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-700 group-hover:border-gray-600 transition-all duration-300"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/96x96/374151/ffffff?text=${(firstName?.[0] || "U")}`
                        }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 rounded-full bg-gray-800/20 group-hover:bg-gray-700/30 transition-all duration-300"></div>
                      {/* New request indicator */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="mb-3">
                      <h2 className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
                        {firstName || "Unknown"} {lastName || "User"}
                      </h2>
                      {age && gender && (
                        <div className="flex items-center mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700">
                            {age} • {gender}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 mb-4">
                      {about || "No description available."}
                    </p>
                    
                    {/* Action buttons */}
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => reviewRequest("accepted", request._id)}
                        disabled={!request._id}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        ✓ Accept
                      </button>
                      <button 
                        onClick={() => reviewRequest("rejected", request._id)}
                        disabled={!request._id}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 rounded-full border border-gray-800">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            <span className="text-gray-400 text-sm">
              {requests.length} pending request{requests.length !== 1 ? 's' : ''} awaiting your response
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Requests