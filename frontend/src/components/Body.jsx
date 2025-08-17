import Footer from './Footer'
import NavBar from './NavBar'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from "../utils/userSlice"
import { useEffect } from 'react'
 
const Body = () => {
  const disptach = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user)

  const fetchUser = async () => {
    if(userData) return;
    try{
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      })
      disptach(addUser(res.data))

    } catch(error){
      if(error.response && error.response.status === 401){
        navigate("/login")
      }
      console.error(error);
    }
  }

  useEffect(() => {
      fetchUser()
  }, []);

  return (
    <div>
        <NavBar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Body