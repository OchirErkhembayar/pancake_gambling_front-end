import React, { useEffect, useState } from "react";

import styles from "./AthleteModal.module.css";

import Modal from "../UI/Modal";
import Card from "../UI/Card";
import Button from "../UI/Button";
import useHttp from "../../hooks/use-http";

const AthleteModal = (props) => {
  const [matches, setMatches] = useState([]);

  const {
    isLoading,
    error,
    sendRequest: fetchAthlete,
  } = useHttp();

  useEffect(() => {
    const transformMatches = (matchObj) => {
      console.log(matchObj.matches);
      setMatches(matchObj.matches);
    };

    fetchAthlete(
      { url: `${process.env.REACT_APP_URL}/athlete/${props.athlete.id}` },
      transformMatches
    );
  }, [fetchAthlete, props.athlete.id]);

  let previousMatches = <p>This athlete has no previous matches.</p>;

  if (isLoading) {
    previousMatches = <p>Loading match history...</p>;
  }

  if (error) {
    previousMatches = <p>Failed to get match history</p>;
  }

  let nextMatch = <p>Next match not finalsed yet.</p>

  if (matches.length > 0) {
    let upcomingMatch = matches.filter((match) => match.result === null);
    if (upcomingMatch.length > 0) {
      console.log(upcomingMatch);
      upcomingMatch.sort((a, b) => {
        return +a.match.date.substring(0, 10).split("-").join("") - +b.match.date.substring(0, 10).split("-").join("")
      })
      upcomingMatch = upcomingMatch[0];
      const opponent = upcomingMatch.match.athletes.find(
        athlete => athlete.id !== props.athlete.id
      );
      nextMatch = (
        <React.Fragment>
          <h3 className={styles.underline}>Next Match</h3>
          <div>
            <Card className={styles.card}>
              <h4 className={styles.underline}>{upcomingMatch.match.title}</h4>
              <p>Date: {upcomingMatch.match.date.substring(0, 10)}</p>
              <p>
                Opponent: {opponent.firstName} {opponent.lastName}
              </p>
            </Card>
          </div>
        </React.Fragment>
      )
    }
    const prevMatches = matches.filter((match) => match.result !== null);
    if (prevMatches.length > 0) {
      previousMatches = (
        <React.Fragment>
          <h3 className={styles.underline}>Match History</h3>
          <div className={styles["prev-matches"]}>
            {prevMatches.map((match) => {
              const opponent = match.match.athletes.find(
                (athlete) => athlete.id !== props.athlete.id
              );
              return (
                <Card className={styles.card}>
                  <h4 className={styles.underline}>{match.match.title}</h4>
                  <p>Date: {match.match.date.substring(0, 10)}</p>
                  <p>
                    Opponent: {opponent.firstName} {opponent.lastName}
                  </p>
                  <p>Result: {match.result ? "Win" : "Loss"}</p>
                </Card>
              );
            })}
          </div>
        </React.Fragment>
      );
    }
  }

  return (
    <Modal className={styles.modal} onClick={props.onClick}>
      <h1>
        {props.athlete.firstName} "{props.athlete.nickName}"{" "}
        {props.athlete.lastName}
      </h1>
      <div className={styles["athlete-details"]}>
        <div className={styles["athlete-details__personal"]}>
          <h3 className={styles.underline}>Details</h3>
          <p>Age: {props.athlete.age}</p>
          <p>Nationality: {props.athlete.nationality}</p>
        </div>
        <div className={styles["athlete-details__record"]}>
          <h3 className={styles.underline}>Record</h3>
          <p>Wins: {props.athlete.wins}</p>
          <p>Losses: {props.athlete.losses}</p>
        </div>
      </div>
      <div className={styles["matches"]}>
        {nextMatch}
        {previousMatches}
      </div>
      <Button onClick={props.onClick}>Close</Button>
    </Modal>
  );
};

export default AthleteModal;
