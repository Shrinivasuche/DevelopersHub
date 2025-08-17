import { useState } from 'react';
import axios from "axios"
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from "react-router-dom"
import { BASE_URL } from '../utils/constants';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLoginForm,  setIsLoginForm] = useState(false)
    const [error, setError] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        
        try {
                const res = await axios.post( BASE_URL + "/login", {
                email,
                password
            }, { withCredentials: true });
            dispatch(addUser(res.data));
            return navigate("/")
        } catch(error){
            setError(error?.response?.data || "Something went wrong")
            console.log(error);
        }
    }

    const handleSingUp = async () => {
        try {
            const res = await axios.post(BASE_URL + "/signup", {
                firstName,
                lastName,
                email,
                password
            }, { withCredentials: true});
            dispatch(addUser(res.data.data));
            return navigate("/profile")
        } catch (error) {
            setError(error?.response?.data || "Something went wrong")
            console.log(error);
        }
    }


  return (
    <div className='flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat' 
         style={{backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"}}>
        <div className="card card-border bg-black/10 backdrop-blur-md w-96 shadow-2xl border border-white/20">
            <div className="card-body">
                <h2 className="card-title justify-center text-white text-2xl font-bold mb-6">
                    {isLoginForm ? "Login" : "Sign Up"}
                </h2>
                <div>
                    {!isLoginForm &&(
                        <>
                            <fieldset className="fieldset my-4">
                                <legend className="fieldset-legend text-white/90">First Name:</legend>
                                <input 
                                    type="text" 
                                    value={firstName} 
                                    className="input bg-white/20 border-white/30 text-white placeholder-white/60 focus:bg-white/30 focus:border-white/50" 
                                    placeholder="Enter your first name"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </fieldset>
                            <fieldset className="fieldset my-4">
                                <legend className="fieldset-legend text-white/90">Last Name</legend>
                                <input 
                                    type="text" 
                                    value={lastName} 
                                    className="input bg-white/20 border-white/30 text-white placeholder-white/60 focus:bg-white/30 focus:border-white/50" 
                                    placeholder="Enter your last name"
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </fieldset>  
                        </>
                    )}
                    <fieldset className="fieldset my-4">
                        <legend className="fieldset-legend text-white/90">Email ID</legend>
                        <input 
                            type="email" 
                            value={email} 
                            className="input bg-white/20 border-white/30 text-white placeholder-white/60 focus:bg-white/30 focus:border-white/50" 
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </fieldset>
                    <fieldset className="fieldset my-4">
                        <legend className="fieldset-legend text-white/90">Password</legend>
                        <input 
                            type="text" 
                            value={password}
                            className="input bg-white/20 border-white/30 text-white placeholder-white/60 focus:bg-white/30 focus:border-white/50" 
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </fieldset>
                </div>
                <p className='text-red-500'>{error}</p>
                <div className="card-actions justify-center my-4">
                    <button onClick={isLoginForm ? handleLogin : handleSingUp} className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white px-8 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105">
                        {isLoginForm ? "Login" : "Sign Up"}
                    </button>
                </div>
                <p className='cursor-pointer text-center' onClick={() => setIsLoginForm((value) => !value)}>
                    {isLoginForm ? "New User ? Sign Up Here" : "Existing User ? Login Here"}
                </p>
            </div>
        </div>
    </div>
)
}

export default Login