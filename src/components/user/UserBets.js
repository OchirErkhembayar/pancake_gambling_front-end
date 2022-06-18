import React, { useState } from 'react'

import styles from "./UserBets.module.css";

import Modal from '../UI/Modal'
import Card from '../UI/Card'

const UserBets = (props) => {
  const [all, setAll] = useState(false);
  const [complete, setComplete] = useState(false);
  const [incomplete, setIncomplete] = useState(true);

  let list = <h1 className={styles.default}>No bets yet!</h1>;

  if (props.bets.length > 0) {
    let bets = props.bets;
    if (complete) {
      bets = bets.filter(bet => {
        return bet.result !== null;
      })
    }
    if (incomplete) {
      bets = bets.filter(bet => {
        return bet.result === null;
      })
    }
    list = <ul className={styles['bet-list']}>
            {bets.map(bet => {
              return (
                <li><Card className={styles.bet} key={bet.id}>
                  <p>Athlete: {bet.matchAthlete.athlete.firstName} {bet.matchAthlete.athlete.lastName}</p>
                  <p>Amount: {bet.amount} pancakes</p>
                  <p>Result: {bet.result !== null ? bet.result ? "Won" : "Lost" : "TBD"}</p>
                </Card></li>
              )
            })}
          </ul>
  }

  const setAllHandler = () => {
    setAll(true);
    setComplete(false);
    setIncomplete(false);
  }

  const setCompleteHandler = () => {
    setAll(false);
    setComplete(true);
    setIncomplete(false);
  }

  const setIncompleteHandler = () => {
    setAll(false);
    setComplete(false);
    setIncomplete(true);
  }

  return (
    <Modal className={styles.modal} onClick={props.onClick}>
      <h2>Your Bets</h2>
      <div className={styles.filters}>
        <h3 onClick={setIncompleteHandler} className={incomplete ? styles.active : ''}>Incomplete</h3>
        <h3 onClick={setCompleteHandler} className={complete ? styles.active : ''}>Complete</h3>
        <h3 onClick={setAllHandler} className={all ? styles.active : ''}>All</h3>
      </div>
      {list}
    </Modal>
  )
}

export default UserBets
