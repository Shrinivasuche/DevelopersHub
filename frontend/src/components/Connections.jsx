import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addConnections } from "../utils/connectionSlice"
import { Link } from "react-router-dom"

const Connections = () => {

    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connections)

    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", {
                withCredentials: true
            })
            dispatch(addConnections(res.data.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchConnections();
    }, [])

    if(!connections) return;

    if(connections.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-8xl mb-6">🔗</div>
                    <h1 className="text-4xl font-bold text-white mb-4">No Connections Yet</h1>
                    <p className="text-xl text-gray-300 mb-8">Start connecting with people to build your network!</p>
                    <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-violet-500 mx-auto rounded-full"></div>
                </div>
            </div>
        );
    }
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                        Connections
                    </h1>
                    <p className="text-xl text-gray-300 mb-6">
                        Your network of {connections.length} connection{connections.length !== 1 ? 's' : ''}
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-violet-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-6">
                    {connections.map((connection, index) => {
                        const {_id, firstName, lastName, photoUrl, age, gender, about} = connection;
                        return (
                            <div 
                                key={_id || index}
                                className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            <img 
                                                src={photoUrl || "https://via.placeholder.com/96x96/6366f1/ffffff?text=" + (firstName?.[0] || "U")} 
                                                alt={`${firstName || "User"} ${lastName || ""}`} 
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white/20 group-hover:border-white/40 transition-all duration-300"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/96x96/6366f1/ffffff?text=" + (firstName?.[0] || "U");
                                                }}
                                            />
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500/20 to-violet-500/20 group-hover:from-pink-500/30 group-hover:to-violet-500/30 transition-all duration-300"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-3">
                                            <h2 className="text-2xl font-bold text-white group-hover:text-pink-200 transition-colors duration-300">
                                                {firstName || "Unknown"} {lastName || "User"}
                                            </h2>
                                            {age && gender && (
                                                <div className="flex items-center mt-2">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500/20 to-violet-500/20 text-pink-200 border border-pink-300/30">
                                                        {age} • {gender}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                                            {about || "No description available."}
                                        </p>
                                        
                                        {/* Optional: Add action buttons */}
                                        <div className="flex space-x-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button  className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30">
                                                <Link to="/profile">Profile</Link>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer stats */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/5 rounded-full border border-white/10">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-gray-300 text-sm">
                            {connections.length} active connection{connections.length !== 1 ? 's' : ''} in your network
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Connections