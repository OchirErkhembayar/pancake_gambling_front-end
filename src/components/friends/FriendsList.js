import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./FriendsList.module.css";

import FriendItem from "./FriendItem";
import UserContext from "../user/user-context";
import AddFriend from "./AddFriend";
import Card from "../UI/Card";

const FriendsList = (props) => {
  const [add, setAdd] = useState(false);

  const userCtx = useContext(UserContext);
  let friendsList = <h1>No friends yet!</h1>;

  if (userCtx.isLoading) {
    friendsList = <h1>Loading friends list...</h1>;
  }

  if (!userCtx.loggedIn && !userCtx.isLoading) {
    return (
      <Card className={styles.card}>
        <h1>Please login to see your friends!</h1>
        <Link to="/auth">Login</Link>
      </Card>
    );
  }

  if (!userCtx.isLoading) {
    const friends = userCtx.user.friends.filter((f) => f.accepted);
    friendsList = friends.map((friend) => {
      return <FriendItem className={styles['friend-item']} key={friend.id} friend={friend} />;
    });
  }

  return (
    <div className={styles.friends}>
      <h1>Friends</h1>
      <div className={styles.nav}>
        <h4 onClick={() => setAdd(false)} className={`${!add ? styles.active : ''} ${styles.hover}`}>Friends</h4>
        <h4 onClick={() => setAdd(true)} className={`${add ? styles.active : ''} ${styles.hover}`}>Add Friends</h4>
      </div>
      {add && <AddFriend className={styles.form}/>}
      {!add && <div className={styles['friends-list']}>
        {friendsList}
      </div>}
    </div>
  );
};

export default FriendsList;
