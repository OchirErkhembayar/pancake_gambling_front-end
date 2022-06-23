import React, { useState, useEffect } from 'react'

import styles from "./Matches.module.css";

import MatchesList from "../../components/matches/MatchesList";
import useHttp from '../../hooks/use-http';


const Matches = () => {
  const [matches, setMatches] = useState([]);

  const { isLoading, error, sendRequest: fetchMatches } = useHttp();

  useEffect(() => {
    const transformMatches = (matchObj) => {
      setMatches(matchObj.matches);
    };

    fetchMatches(
      { url: `${process.env.REACT_APP_URL}/match/upcoming-matches`},
      transformMatches
    )
  }, [fetchMatches])

  return (
    <div className={styles.matches}>
      <MatchesList
        matches={matches}
        loading={isLoading}
        error={error}
        onFetch={fetchMatches}
      />
    </div>
  )
}

export default Matches
