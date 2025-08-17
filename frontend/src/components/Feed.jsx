import { useDispatch, useSelector } from "react-redux"
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed)
  const dispatch = useDispatch()

  const getFeed = async () => {
    if(feed) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true
      });
      dispatch(addFeed(res?.data?.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getFeed();
  }, [])

  if(!feed) return;

  if(feed.length <= 0) return <h1 className="flex justify-center my-10">No user found!</h1>

  return (
    feed && ( 
      <div className="flex justify-center">
        <UserCard user={feed[0]}/>
      </div>
    )
  )
}

export default Feed