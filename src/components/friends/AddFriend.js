import React, { useRef, useState, useContext } from "react";

import styles from "./AddFriend.module.css";

import Card from "../UI/Card";
import Button from "../UI/Button";
import useHttp from "../../hooks/use-http";
import UserContext from "../user/user-context";

const AddFriend = () => {
  const userCtx = useContext(UserContext);
  const usernameRef = useRef();
  const [valid, setValid] = useState(true);
  const [users, setUsers] = useState(null);

  const {
    isLoading: usersLoading,
    error: usersError,
    sendRequest: fetchUsers,
    removeError: removeUsersError,
  } = useHttp();

  const submitHandler = (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    if (username.trim().length === 0) {
      return setValid(false);
    }
    setValid(true);

    const transformUsers = async (userObj) => {
      const existingFriends = userCtx.user.friends.map(
        (friend) => friend.userId
      );
      const filteredUsers = userObj.users.filter((user) => {
        return !existingFriends.includes(user.id);
      });
      const usersList = filteredUsers.map((user) => {
        return (
          <Card
            onClick={() => {
              if (!userCtx.addFriendLoading) {
                userCtx.addFriend(user.id);
                setUsers(null);
              }
            }}
            key={user.id}
            className={styles.user}
          >
            {!userCtx.addFriendLoading && (
              <React.Fragment>
                <p>{user.username}</p>
                <i className={`fa-solid fa-plus ${styles.icon}`}></i>
              </React.Fragment>
            )}
            {userCtx.addFriendLoading && <p>Adding friend...</p>}
          </Card>
        );
      });
      setUsers(usersList);
      removeUsersError();
    };

    fetchUsers(
      {
        url: `${process.env.REACT_APP_URL}/friend/users`,
        body: {
          username: username.toLowerCase(),
        },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userCtx.token,
        },
      },
      transformUsers
    );

    usernameRef.current.value = "";
  };

  return (
    <Card className={styles.card}>
      <h2 className={styles.title}>Add a friend</h2>
      <form className={styles.form}>
        <div className={styles["form-control"]}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" ref={usernameRef} />
          {!valid && <p className={styles.error}>Please enter a username</p>}
        </div>
        <div className={styles["form-actions"]}>
          <Button onClick={submitHandler} className={styles.button}>
            Submit
          </Button>
        </div>
      </form>
      <div className={styles["users-list"]}>{users}</div>
      {users && users.length === 0 && <p>No users found!</p>}
      {usersLoading && <p>Loading users...</p>}
      {usersError && <p>Failed to fetch users.</p>}
    </Card>
  );
};

export default AddFriend;
