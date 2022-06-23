import React from 'react'

import AthleteItem from './AthleteItem'

import styles from "./AthletesList.module.css";

const AthletesList = (props) => {
  let athleteList = <h3 className={styles.athletes}>No athletes found.</h3>;

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
    content = <h3 className={styles.athletes}>Server error. Please try again later.</h3>;
  }

  if (props.loading) {
    content = <h3 className={styles.athletes}>Loading athletes...</h3>;
  }

  return (
    <React.Fragment>
      {content}
    </React.Fragment>
  )
}

export default AthletesList
