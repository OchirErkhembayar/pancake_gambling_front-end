import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import styles from "./Navbar.module.css";
import UserContext from "../user/user-context";
import UserBets from "../user/UserBets";
import FriendRequests from "../user/FriendRequests";

const Navbar = () => {
  const userCtx = useContext(UserContext);

  const [toggleMenu, setToggleMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showModal, setShowModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);

  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", changeWidth);
  }, []);

  const closeNav = () => {
    setToggleMenu(false);
  };

  const toggleNav = () => {
    setToggleMenu((prevState) => !prevState);
  };

  const showModalHandler = () => {
    userCtx.fetchUserDetails();
    closeNav();
    setShowModal(true);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  const showFriendsListModalHandler = () => {
    closeNav();
    setShowFriendsModal(true);
  };

  const hideFriendsListModalHandler = () => {
    closeNav();
    setShowFriendsModal(false);
  };

  const logoutButtonHandler = () => {
    userCtx.logout();
    closeNav();
  };

  let authButton = (
    <li className={styles.items}>
      <NavLink activeClassName={styles.active} onClick={closeNav} to="/auth">
        Login
      </NavLink>
    </li>
  );

  let friendsButton = null;

  if (userCtx.loggedIn) {
    authButton = (
      <li
        className={`${styles.items} ${styles.hover}`}
        onClick={logoutButtonHandler}
      >
        Logout
      </li>
    );
    friendsButton = (
      <li className={styles.items}>
        <NavLink
          onClick={closeNav}
          activeClassName={styles.active}
          to="/friends"
        >
          Friends
        </NavLink>
      </li>
    );
  }

  let bets;
  let balance;
  let friends;

  if (!userCtx.loggedIn) {
    bets = null;
    balance = null;
    friends = null;
  }

  let betCount = "";
  if (userCtx.user.privateBets) {
    betCount =
      userCtx.user.privateBets.filter(
        (bet) => bet.privateBetUsers[0].confirmed === false && bet.privateBetUsers.find(pb => pb.userId === userCtx.user.id).sender === false
      ).length > 0
        ? `(${
            userCtx.user.privateBets.filter(
              (bet) => bet.privateBetUsers[0].confirmed === false && bet.privateBetUsers.find(pb => pb.userId === userCtx.user.id).sender === false
            ).length
          })`
        : "";
  }


  if (!userCtx.isLoading && userCtx.loggedIn) {
    bets = (
      <li
        className={`${styles.items} ${styles.hover}`}
        onClick={showModalHandler}
      >
        Bets{betCount}
      </li>
    );
    balance = (
      <li className={`${styles.items} ${styles.nonHover} ${styles.balance}`}>
        Balance: {Math.floor(userCtx.user.balance)} pancakes
      </li>
    );
    friends = (
      <li className={`${styles.items}`} onClick={showFriendsListModalHandler}>
        <i className={`${styles.icon} fa-solid fa-user-group`}></i>
        {userCtx.user.friends.filter((f) => !f.accepted && f.sender).length > 0
          ? ` (${
              userCtx.user.friends.filter((f) => !f.accepted && f.sender).length
            })`
          : ""}
      </li>
    );
    if (
      userCtx.user.friends.filter((f) => !f.accepted && f.sender).length === 0
    ) {
      friends = null;
    }
  }

  if (userCtx.isLoading) {
    balance = (
      <li className={`${styles.items} ${styles.noPointer}`}>Loading...</li>
    );
    bets = (
      <li className={`${styles.items} ${styles.noPointer}`}>Loading...</li>
    );
    friends = (
      <li className={`${styles.items} ${styles.noPointer}`}>Loading...</li>
    );
  }

  return (
    <React.Fragment>
      {showFriendsModal && (
        <FriendRequests onClick={hideFriendsListModalHandler} />
      )}
      {showModal && (
        <UserBets
          privateBets={userCtx.user.privateBets}
          bets={userCtx.user.bets}
          onClick={hideModalHandler}
        />
      )}
      <nav className={styles.nav}>
        <div className={styles.title} onClick={closeNav}>
          <Link to="/">
            <h1>Pancake Gambling</h1>
          </Link>
          {userCtx.loggedIn && !userCtx.isLoading && (
            <h3 className={styles.username}>Hello, {userCtx.user.username}</h3>
          )}
        </div>
        {(toggleMenu || screenWidth > 687) && (
          <ul className={styles.list}>
            {balance}
            {bets}
            {friends}
            {friendsButton}
            <li className={styles.items}>
              <NavLink
                onClick={closeNav}
                activeClassName={styles.active}
                to="/matches"
              >
                Matches
              </NavLink>
            </li>
            <li className={styles.items}>
              <NavLink
                onClick={closeNav}
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

export default Navbar;
