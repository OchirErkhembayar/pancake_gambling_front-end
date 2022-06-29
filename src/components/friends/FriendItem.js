import React, { useState, useContext } from "react";

import styles from "./FriendItem.module.css";
import Card from "../UI/Card";
import Button from "../UI/Button";
import FriendModal from "./FriendModal";
import UserContext from "../user/user-context";

const FriendItem = (props) => {
  const userCtx = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);

  const user = props.friend.user;

  const deleteFriendHandler = () => {
    userCtx.deleteFriend(props.friend.id);
  };

  if (userCtx.deleteFriendLoading) {
    return (
      <React.Fragment>
        <Card className={`${props.className} ${styles.friend}`}>
          <h2>{user.username}</h2>
          <p>Loading...</p>
        </Card>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {showModal && (
        <FriendModal
          friend={props.friend.user}
          onClick={() => setShowModal(false)}
        />
      )}
      <Card className={`${props.className} ${styles.friend}`}>
        <h2>{user.username}</h2>
        <Button onClick={() => setShowModal(true)} className={styles.bet}>
          Create private bet
        </Button>
        <i
          onClick={deleteFriendHandler}
          className={`fa-solid fa-xmark ${styles.decline}`}
        ></i>
      </Card>
    </React.Fragment>
  );
};

export default FriendItem;
