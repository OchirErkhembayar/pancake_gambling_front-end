import React, { useState } from "react";

import styles from "./FriendItem.module.css";
import Card from "../UI/Card";
import Button from "../UI/Button";
import FriendModal from "./FriendModal";

const FriendItem = (props) => {
  const [showModal, setShowModal] = useState(false);

  const user = props.friend.user;

  return (
    <React.Fragment>
      {showModal && <FriendModal friend={props.friend.user} onClick={() => setShowModal(false)} />}
      <Card className={`${props.className} ${styles.friend}`}>
        <h2>{user.username}</h2>
        <Button onClick={() => setShowModal(true)} className={styles.bet}>Create private bet</Button>
        <i className={`fa-solid fa-xmark ${styles.decline}`}></i>
      </Card>
    </React.Fragment>
  );
};

export default FriendItem;
