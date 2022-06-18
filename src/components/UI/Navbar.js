import React, { useState } from 'react'

import styles from "./Navbar.module.css";
import UserBets from '../user/UserBets';

const Navbar = (props) => {
  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  }

  const hideModalHandler = () => {
    setShowModal(false);
  }

  return (
    <React.Fragment>
      {showModal && <UserBets bets={props.user.bets} onClick={hideModalHandler} />}
      <nav className={styles.navbar}>
        <h1>Pancake Gambling</h1>
        {props.user.username && <div className={styles.navigation}>
          <h3>Hello, {props.user.username}</h3>
          <p>Current balance: {props.user.balance.toFixed(0)} pancakes</p>
          <p className={styles.bets} onClick={showModalHandler}>Bets{props.user.bets.length > 0 ? `(${props.user.bets.length})` : ''}</p>
        </div>}
      </nav>
    </React.Fragment>
  )
}

export default Navbar
