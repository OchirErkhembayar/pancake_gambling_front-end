import React from 'react'

import AthleteItem from './AthleteItem'

import styles from "./AthletesList.module.css";

const AthletesList = (props) => {
  let athleteList = <h2>No athletes found.</h2>;

  console.log(props)

  if (props.athletes.length > 0) {
    athleteList = (
      <div className={styles.athletes}>
        <h1>Athletes</h1>
        <div className={styles['athlete-list']}>
          {props.athletes.map(athlete => {
            return <AthleteItem athlete={athlete} key={athlete.id} />
          })}
        </div>
      </div>
    );
  }

  let content = athleteList;

  if (props.error) {
    content = <h2>Server error. Please try again later.</h2>;
  }

  if (props.loading) {
    content = 'Loading athletes...';
  }

  return (
    <React.Fragment>
      {content}
    </React.Fragment>
  )
}

export default AthletesList
