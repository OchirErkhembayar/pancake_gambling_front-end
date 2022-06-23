import React from 'react'

import styles from "./MatchesList.module.css";

import MatchItem from './MatchItem';

const MatchesList = (props) => {
  let matchList = <h3 className={styles.matches}>No matches found.</h3>;

  if (props.matches.length > 0) {
    matchList = (
      <div className={styles['match-list']}>
        <h1>Upcoming Matches</h1>
        {props.matches.map(match => {
          return <MatchItem match={match} key={match.id} />
        })}
      </div>
    );
  }

  let content = matchList;

  if (props.error) {
    content = <h3 className={styles.matches}>Server error. Please try again later.</h3>;
  }

  if (props.loading) {
    content = <h3 className={styles.matches}>Loading matches...</h3>;
  }

  return (
    <React.Fragment>
      {content}
    </React.Fragment>
  )
}

export default MatchesList
