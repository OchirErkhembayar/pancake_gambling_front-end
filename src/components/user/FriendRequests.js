import React, { useContext } from "react";

import styles from "./FriendRequests.module.css";
import UserContext from "./user-context";
import Card from "../UI/Card";
import Modal from "../UI/Modal";

const FriendRequests = (props) => {
  const userCtx = useContext(UserContext);

  let list = <h1 className={styles.default}>All clear!</h1>;

  const requests = userCtx.user.friends.filter((f) => !f.accepted && f.sender);

  if (requests.length > 0) {
    list = (
      <ul className={styles["requests-list"]}>
        {requests.map((request) => {
          return (
            <li key={request.id}>
              <Card className={styles.request}>
                <p>{request.user.username}</p>
                <div className={styles.actions}>
                  <i
                    onClick={() => {
                      userCtx.acceptFriend(request.id)
                    }}
                    className={`fa-solid fa-check ${styles.accept}`}
                  ></i>
                  <i className={`fa-solid fa-xmark ${styles.decline}`}></i>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    // <FriendsList />
    <Modal className={styles.modal} onClick={props.onClick}>
      <h2>Friend Requests</h2>
      {list}
    </Modal>
  );
};

export default FriendRequests;
