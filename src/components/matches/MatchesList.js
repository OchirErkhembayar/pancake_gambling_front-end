import React from 'react'

import styles from "./MatchesList.module.css";

import MatchItem from './MatchItem';

const MatchesList = (props) => {
  let matchList = <h2>No matches found.</h2>;

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
    content = <h2>Server error. Please try again later.</h2>;
  }

  if (props.loading) {
    content = 'Loading matches...';
  }

  return (
    <React.Fragment>
      {content}
    </React.Fragment>
  )
}

export default MatchesList
