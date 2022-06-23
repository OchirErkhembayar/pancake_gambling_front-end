import React, { useState, useEffect } from 'react'

import styles from "./Athletes.module.css";

import useHttp from '../../hooks/use-http';
import AthletesList from '../athletes/AthletesList'

const Athletes = () => {
  const [athletes, setAthletes] = useState([]);

  const { isLoading, error, sendRequest: fetchAthletes } = useHttp();

  useEffect(() => {
    const transformAthletes = (athleteObj) => {
      console.log(athleteObj.athletes);
      setAthletes(athleteObj.athletes);
    };;

    fetchAthletes(
      { url: `${process.env.REACT_APP_URL}/athlete/all-athletes`},
      transformAthletes
    )
  }, [fetchAthletes])

  return (
    <AthletesList
      className={styles.athletes}
      athletes={athletes}
      loading={isLoading}
      error={error}
      onFetch={fetchAthletes}
    />
  )
}

export default Athletes
