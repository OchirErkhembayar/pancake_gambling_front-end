import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import styles from "./Navbar.module.css";
import UserBets from "../user/UserBets";
import Button from "../UI/Button";
import UserContext from "../user/user-context";

const Navbar = (props) => {
  const userCtx = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  const logoutHandler = () => {
    userCtx.logout();
  };

  if (userCtx.isLoading) {
    return (
      <React.Fragment>
        <nav className={styles.navbar}>
          <h1 className={`${styles.mobile} ${styles.logoButton}`}>
            Pancake Gambling
          </h1>
          <p>Loading...</p>
        </nav>
      </React.Fragment>
    );
  }

  let content = (
    <Link to="/auth">
      <Button onClick={props.showLoginPage}>Login</Button>
    </Link>
  );

  if (userCtx.loggedIn) {
    content = (
      <React.Fragment>
        <p className={`${styles.mobile} ${styles.balance}`}>Balance: {Math.floor(userCtx.user.balance)} pancakes</p>
        <p className={styles.bets} onClick={showModalHandler}>
          Bets
          {userCtx.user.bets.filter(bet => bet.result === null).length > 0
            ? `(${
                userCtx.user.bets.filter((bet) => bet.result === null).length
              })`
            : ""}
        </p>
        <Button onClick={logoutHandler} className={styles.Button}>
          logout
        </Button>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {showModal && (
        <UserBets privateBets={userCtx.user.privateBets} bets={userCtx.user.bets} onClick={hideModalHandler} />
      )}
      <nav className={styles.navbar}>
        <div className={styles.titles}>
          <Link className={styles.logoButton} to="/">
            <h1 className={`${styles.mobile} ${styles.logoButton}`}>
              Pancake Gambling
            </h1>
          </Link>
          {userCtx.loggedIn && (
            <h3 className={`${styles.mobile} ${styles.user}`}>Hello, {userCtx.user.username}</h3>
          )}
        </div>
        <div className={styles.navigation}>
          <NavLink activeClassName={styles.active} to="/matches">
            Matches
          </NavLink>
          <NavLink activeClassName={styles.active} to="/athletes">
            Athletes
          </NavLink>
          {content}
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;
