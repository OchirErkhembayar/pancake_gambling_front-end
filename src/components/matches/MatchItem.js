import React, { useState } from 'react'

import styles from "./MatchItem.module.css";

import Card from '../UI/Card';
import MatchModal from './MatchModal';

const MatchItem = (props) => {
  const [hiddenModal, setHiddenModal] = useState(true);

  let date = "Unconfirmed";
  let weightLimit = "No-limit"

  const showModalHandler = () => {
    setHiddenModal(false);
  }

  const hideModalHandler = () => {
    setHiddenModal(true);
  }

  if (props.match.date) {
    date = props.match.date.split("T")[0];
  }

  if (props.match.weightLimit) {
    weightLimit = props.match.weightLimit + "kg";
  }

  const athleteOne = props.match.athletes[0];
  const athleteOneOdds = athleteOne.matchAthlete.odds;
  const athleteOneMAId = athleteOne.matchAthlete.id;
  const athleteTwo = props.match.athletes[1];
  const athleteTwoOdds = athleteTwo.matchAthlete.odds;
  const athleteTwoMAId = athleteTwo.matchAthlete.id;

  return (
    <React.Fragment>
      {!hiddenModal && <MatchModal
        onClick={hideModalHandler}
        match={props.match}
        athleteOne={athleteOne.firstName + ' ' + athleteOne.lastName}
        athleteOneOdds={athleteOneOdds}
        athleteTwo={athleteTwo.firstName + ' ' + athleteTwo.lastName}
        athleteTwoOdds={athleteTwoOdds}
        athleteOneMAId={athleteOneMAId}
        athleteTwoMAId={athleteTwoMAId}
      />}
      <Card
        onClick={showModalHandler}
        className={styles['match-item']}
      >
        <div className={styles['match-item__details']}>
          <h2>{athleteOne.firstName} "{athleteOne.nickName}" {athleteOne.lastName}</h2>
          <h2>{athleteTwo.firstName} "{athleteTwo.nickName}" {athleteTwo.lastName}</h2>
          <h3>{props.match.title}</h3>
        </div>
        <div className={styles['match-item__dates']}>
          <h3 className={styles.mobile}>{props.match.city}, {props.match.country}</h3>
          <h3 className={styles.mobile}>{date}</h3>
          <h4 className={styles.mobile}>Weightlimit: {weightLimit}</h4>
          <h4 className={styles.mobile2}>Odds: {athleteOne.firstName}({athleteOneOdds}) - {athleteTwo.firstName}({athleteTwoOdds})</h4>
        </div>
      </Card>
    </React.Fragment>
  )
}

export default MatchItem
