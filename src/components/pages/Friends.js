import React, { useContext, useState, useEffect } from 'react'

import styles from "./Friends.module.css";
import UserContext from "../user/user-context";
import FriendsList from '../friends/FriendsList';

const Friends = () => {
  const userCtx = useContext(UserContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    setFriends(userCtx.user.friends);
  }, [userCtx.user.friends]);

  let friendsList = <h1>No friends.</h1>

  if (userCtx.isLoading) {
    friendsList = <h1>Loading...</h1>
  }

  return (
    <div>
      <FriendsList />
    </div>
  )
}

export default Friends
