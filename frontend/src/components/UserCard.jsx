import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState } from "react";

const UserCard = ({ user }) => {
    if (!user) return null;

    const { _id, firstName, lastName, photoUrl, gender, age, about } = user;
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    const dispatch = useDispatch();
    
    const handleSendRequest = async (status, userId) => {
        if (!userId || isLoading) return;

        try {
            setIsLoading(true);
            const res = await axios.post(
                `${BASE_URL}/request/send/${status}/${userId}`,
                {}, 
                {
                    withCredentials: true
                }
            );
            
            if (res.status === 200 || res.status === 201) {
                dispatch(removeUserFromFeed(userId));
            }
        } catch (error) {
            console.error(`Error sending ${status} request:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const getPlaceholderImage = () => {
        const initial = firstName?.[0] || "U";
        return `https://via.placeholder.com/400x500/1f2937/ffffff?text=${initial}`;
    };

    return (
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl hover:shadow-3xl hover:shadow-purple-500/10 transition-all duration-500 w-96 hover:scale-105 hover:border-gray-600/50">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Image section */}
            <div className="relative h-80 overflow-hidden">
                <img
                    src={imageError ? getPlaceholderImage() : (photoUrl || getPlaceholderImage())}
                    alt={`${firstName || "User"} ${lastName || ""}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={handleImageError}
                    loading="lazy"
                />
                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Status indicator */}
                <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white/20"></div>
                </div>
            </div>

            {/* Content section */}
            <div className="relative p-6 space-y-4">
                {/* Name */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
                        {firstName || "Unknown"} {lastName || "User"}
                    </h2>
                    
                    {/* Age and Gender badge */}
                    {(age || gender) && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
                            <span className="text-sm font-medium text-gray-300">
                                {age && gender ? `${age} • ${gender}` : age || gender}
                            </span>
                        </div>
                    )}
                </div>

                {/* About section */}
                <div className="space-y-2">
                    <p className="text-gray-400 leading-relaxed text-sm line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
                        {about || "No description available."}
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3 pt-4">
                    <button 
                        onClick={() => handleSendRequest("ignored", _id)}
                        disabled={!_id || isLoading}
                        className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 group/btn"
                    >
                        <span className="flex items-center justify-center space-x-2">
                            <span className="text-lg group-hover/btn:scale-110 transition-transform duration-200">👋</span>
                            <span>{isLoading ? "..." : "Ignore"}</span>
                        </span>
                    </button>
                    
                    <button 
                        onClick={() => handleSendRequest("interested", _id)}
                        disabled={!_id || isLoading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 group/btn"
                    >
                        <span className="flex items-center justify-center space-x-2">
                            <span className="text-lg group-hover/btn:scale-110 transition-transform duration-200">💕</span>
                            <span>{isLoading ? "..." : "Interested"}</span>
                        </span>
                    </button>
                </div>

                {/* Loading indicator */}
                {isLoading && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/5 to-transparent group-hover:top-full transition-all duration-1000 transform skew-y-12"></div>
        </div>
    );
};

export default UserCard;