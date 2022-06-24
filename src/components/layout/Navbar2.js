import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import styles from "./Navbar2.module.css";
import Button from "../UI/Button";
import UserContext from "../user/user-context";
import UserBets from "../user/UserBets";

const Navbar2 = () => {
  const userCtx = useContext(UserContext);

  const [toggleMenu, setToggleMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", changeWidth);
  }, []);

  const toggleNav = () => {
    setToggleMenu((prevState) => !prevState);
  };

  const showModalHandler = () => {
    toggleNav();
    setShowModal(true);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  const logoutButtonHandler = () => {
    userCtx.logout();
    toggleNav();
  }

  let authButton = (
    <li className={styles.items}>
      <NavLink activeClassName={styles.active} onClick={toggleNav} to="/auth">
        Login
      </NavLink>
    </li>
  );

  if (userCtx.loggedIn) {
    authButton = (
      <li className={`${styles.items} ${styles.hover}`} onClick={logoutButtonHandler}>
        Logout
      </li>
    );
  }

  let bets = (
    <li className={`${styles.items} ${styles.noPointer}`}>
      Loading...
    </li>
  );

  let balance = (
    <li className={`${styles.items} ${styles.noPointer}`}>
      Loading...
    </li>
  );

  if (!userCtx.loggedIn) {
    bets = null;
    balance = null;
  }

  if (!userCtx.isLoading && userCtx.loggedIn) {
    bets = (
      <li className={`${styles.items} ${styles.hover}`} onClick={showModalHandler}>
        Bets
        {userCtx.user.bets.filter((bet) => bet.result === null).length > 0
          ? `(${userCtx.user.bets.filter((bet) => bet.result === null).length})`
          : ""}
      </li>
    );
    balance = (
      <li className={`${styles.items} ${styles.nonHover} ${styles.balance}`}>
        Balance: {Math.floor(userCtx.user.balance)} pancakes
      </li>
    );
  }

  return (
    <React.Fragment>
      {showModal && (
        <UserBets bets={userCtx.user.bets} onClick={hideModalHandler} />
      )}
      <nav className={styles.nav}>
        <div className={styles.title}>
          <Link to="/">
            <h1>Pancake Gambling</h1>
          </Link>
          { userCtx.loggedIn && !userCtx.isLoading && <h3 className={styles.username}>Hello, {userCtx.user.username}</h3>}
        </div>
        {(toggleMenu || screenWidth > 610) && (
          <ul className={styles.list}>
            {balance}
            {bets}
            <li className={styles.items}>
              <NavLink
                onClick={toggleNav}
                activeClassName={styles.active}
                to="/matches"
              >
                Matches
              </NavLink>
            </li>
            <li className={styles.items}>
              <NavLink
                onClick={toggleNav}
                activeClassName={styles.active}
                to="/athletes"
              >
                Athletes
              </NavLink>
            </li>
            {authButton}
          </ul>
        )}

        <button onClick={toggleNav} className={styles.btn}>
          <i className="fa-solid fa-bars"></i>
        </button>
      </nav>
    </React.Fragment>
  );
};

export default Navbar2;
