import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice"

const EditProfile = ({ user }) => {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [age, setAge] = useState(user.age || "");
    const [gender, setGender] = useState(user.gender || "");
    const [about, setAbout] = useState(user.about || "");
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch()

    const saveProfile = async () => {
        setError("");
        setIsLoading(true);
        
        try {
            const res = await axios.patch(BASE_URL + "/profile/edit", {
                firstName, 
                lastName, 
                gender, 
                age: parseInt(age), 
                about, 
                photoUrl
            }, {
                withCredentials: true
            })

            dispatch(addUser(res?.data?.data))

            setShowToast(true)

            setTimeout(() => {
                setShowToast(false)
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || error.response?.data || "Failed to save profile")
        } finally {
            setIsLoading(false);
        }
    }

    const resetForm = () => {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setAge(user.age);
        setGender(user.gender);
        setAbout(user.about);
        setPhotoUrl(user.photoUrl);
        setError("");
    }

    // Live Preview Component
    const LivePreviewCard = () => {
        const [isImageLoading, setIsImageLoading] = useState(true);
        const [imageError, setImageError] = useState(false);
        
        const handleImageLoad = () => {
            setIsImageLoading(false);
        };
        
        const handleImageError = () => {
            setIsImageLoading(false);
            setImageError(true);
        };

        return (
            <div className="group relative w-96 mx-auto">
                {/* Main Card */}
                <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 hover:shadow-3xl hover:shadow-gray-900/50">
                    
                    {/* Image Section */}
                    <div className="relative h-80 overflow-hidden bg-gray-800">
                        {isImageLoading && photoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        )}
                        
                        {photoUrl ? (
                            <img
                                src={imageError ? `https://via.placeholder.com/400x320/374151/ffffff?text=${firstName?.[0] || 'U'}` : photoUrl}
                                alt={`${firstName || 'User'} ${lastName || ''}`}
                                className={`w-full h-full object-cover transition-all duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                <div className="text-center">
                                    <svg className="w-16 h-16 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-500 text-sm">Add photo URL</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Preview Badge */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2">
                            <span className="text-white text-sm font-medium bg-blue-600/80 px-3 py-1 rounded-full backdrop-blur-sm">
                                Preview
                            </span>
                        </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6 space-y-4">
                        {/* Name and Basic Info */}
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {firstName || "Enter first name"} {lastName || "Enter last name"}
                            </h2>
                            
                            {(age || gender) && (
                                <div className="flex justify-center mb-3">
                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700">
                                        {age || "Age"} {age && gender && "•"} {gender || "Gender"}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* About Section */}
                        <div className="text-center">
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {about || "Tell others about yourself..."}
                            </p>
                        </div>
                        
                        
                        
                        {/* Preview Note */}
                        <div className="text-center pt-2">
                            <span className="text-xs text-gray-500 italic">
                                This is how others will see your profile
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Card Shadow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Edit Your Profile</h1>
                    <p className="text-gray-400 text-lg">Update your information and see how it looks</p>
                    <div className="w-24 h-1 bg-white mx-auto rounded-full mt-4"></div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8 justify-center items-start">
                    {/* Edit Form */}
                    <div className="w-full xl:w-auto">
                        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl w-full max-w-md mx-auto xl:mx-0">
                            <div className="flex items-center justify-center mb-8">
                                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white ml-3">Profile Details</h2>
                            </div>

                            <div className="space-y-6">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        First Name *
                                    </label>
                                    <input 
                                        type="text" 
                                        value={firstName} 
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your first name"
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Last Name *
                                    </label>
                                    <input 
                                        type="text" 
                                        value={lastName}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your last name"
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Age
                                    </label>
                                    <input 
                                        type="number" 
                                        value={age}
                                        min="18"
                                        max="100"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your age"
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Gender
                                    </label>
                                    <select 
                                        value={gender}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>

                                {/* About */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        About You
                                    </label>
                                    <textarea 
                                        value={about}
                                        rows={4}
                                        maxLength={500}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 resize-none"
                                        placeholder="Tell us about yourself..."
                                        onChange={(e) => setAbout(e.target.value)}
                                    />
                                    <div className="text-right text-xs text-gray-500 mt-1">
                                        {about?.length || 0}/500 characters
                                    </div>
                                </div>

                                {/* Photo URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Photo URL
                                    </label>
                                    <input 
                                        type="url" 
                                        value={photoUrl}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                                        placeholder="https://example.com/your-photo.jpg"
                                        onChange={(e) => setPhotoUrl(e.target.value)}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        Enter a valid image URL for your profile picture
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-red-300 text-sm">{error}</span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex space-x-4 mt-8">
                                <button 
                                    onClick={resetForm}
                                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                    disabled={isLoading}
                                >
                                    Reset
                                </button>
                                <button 
                                    onClick={saveProfile}
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : 'Save Profile'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Live Preview Card */}
                    <div className="w-full xl:w-auto flex justify-center">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4 text-center flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Live Preview
                            </h3>
                            <LivePreviewCard />
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-green-900 border border-green-700 text-green-300 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Profile saved successfully!</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditProfile