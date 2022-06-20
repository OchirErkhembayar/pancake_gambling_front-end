import React, { useState, useContext } from 'react'

import styles from "./Navbar.module.css";
import UserBets from '../user/UserBets';
import Button from './Button';
import UserContext from '../user/user-context';

const Navbar = (props) => {
  const userCtx = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  }

  const hideModalHandler = () => {
    setShowModal(false);
  }

  const logoutHandler = () => {
    userCtx.logout();
  }

  return (
    <React.Fragment>
      {showModal && <UserBets bets={props.user.bets} onClick={hideModalHandler} />}
      <nav className={styles.navbar}>
        <h1 onClick={props.showBannerHandler} className={styles.mobile}>Pancake Gambling</h1>
        {userCtx.loggedIn && <div className={styles.navigation}>
          <h3 className={styles.mobile}>Hello, {userCtx.user.username}</h3>
          <p>Balance: {userCtx.user.balance.toFixed(0)} pancakes</p>
          <p className={styles.bets} onClick={showModalHandler}>Bets{props.user.bets.length > 0 ? `(${props.user.bets.filter(bet => bet.result === null).length})` : ''}</p>
          <Button onClick={logoutHandler} className={styles.Button}>logout</Button>
        </div>}
        {!userCtx.loggedIn && !props.loginPage && <Button onClick={props.showLoginPage}>Login</Button>}
      </nav>
    </React.Fragment>
  )
}

export default Navbar
