import React, { useState, useContext } from "react";

import styles from "./UserBets.module.css";

import Modal from "../UI/Modal";
import Card from "../UI/Card";
import UserContext from "./user-context";
import useHttp from "../../hooks/use-http";

const UserBets = (props) => {
  const [all, setAll] = useState(false);
  const [complete, setComplete] = useState(false);
  const [incomplete, setIncomplete] = useState(true);
  const [privateBets, setPrivateBets] = useState(false);
  const [viewPrivateBets, setViewPrivateBets] = useState(false);
  const userCtx = useContext(UserContext);
  const {
    error: acceptingError,
    isLoading: acceptLoading,
    sendRequest: acceptBet,
  } = useHttp();
  const {
    error: decliningError,
    isLoading: declineLoading,
    sendRequest: declineBet,
  } = useHttp();

  const onAcceptBet = (e, privateBetUser) => {
    e.preventDefault();
    if (userCtx.user.balance < privateBetUser.amount) {
      return;
    }
    const transformUser = (betObj) => {
      props.onClick();
      userCtx.onRemovePancakes(privateBetUser.amount);
      userCtx.user.privateBets.forEach((privateBet) => {
        if (privateBet.id === privateBetUser.privateBetId) {
          privateBet.privateBetUsers.forEach((privateBetUser) => {
            privateBetUser.confirmed = true;
          });
        }
      });
    };

    acceptBet(
      {
        url: `${process.env.REACT_APP_URL}/bet/accept-private-bet`,
        body: {
          privateBetId: privateBetUser.privateBetId,
        },
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userCtx.token,
        },
      },
      transformUser
    );
  };

  const onDeclineBet = (e, privateBetUser) => {
    e.preventDefault();
    const transformUser = (betObj) => {
      props.onClick();
      userCtx.onRemovePrivateBet(privateBetUser.privateBetId);
    };

    declineBet(
      {
        url: `${process.env.REACT_APP_URL}/bet/decline-private-bet`,
        body: {
          privateBetId: privateBetUser.privateBetId,
        },
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userCtx.token,
        },
      },
      transformUser
    );
  };

  let list = <h1 className={styles.default}>No bets yet!</h1>;

  if (props.bets.length > 0 || props.privateBets.length > 0) {
    let bets = props.bets;
    if (complete) {
      bets = bets.filter((bet) => {
        return bet.result !== null;
      });
    }
    if (incomplete) {
      bets = bets.filter((bet) => {
        return bet.result === null;
      });
    }
    if (privateBets) {
      bets = props.privateBets.filter((bet) => {
        return (
          bet.privateBetUsers[0].result === null &&
          bet.privateBetUsers[0].confirmed === false
        );
      });
    }
    if (viewPrivateBets) {
      bets = props.privateBets.filter((bet) => {
        return (
          bet.privateBetUsers[0].confirmed === true
        );
      });
    }
    list = (
      <ul className={styles["bet-list"]}>
        {bets.map((bet) => {
          if (!privateBets && !viewPrivateBets) {
            return (
              <li key={bet.id}>
                <Card className={styles.bet}>
                  <p>
                    Athlete: {bet.matchAthlete.athlete.firstName}{" "}
                    {bet.matchAthlete.athlete.lastName}
                  </p>
                  <p>Amount: {bet.amount} pancakes</p>
                  <p>
                    Result:{" "}
                    {bet.result !== null
                      ? bet.result
                        ? "Won"
                        : "Lost"
                      : "TBD"}
                  </p>
                </Card>
              </li>
            );
          } else if (privateBets) {
            const senderPrivateBetUser = bet.privateBetUsers.find(
              (pb) => pb.userId !== userCtx.user.id
            );
            const myPrivateBetUser = bet.privateBetUsers.find(
              (pb) => pb.userId === userCtx.user.id
            );
            const winner = senderPrivateBetUser.matchAthlete.athlete;
            const loser = senderPrivateBetUser.matchAthlete.match.athletes.find(
              (a) => a.id !== winner.id
            );
            return (
              <li key={bet.id}>
                <Card className={styles.privateBets}>
                  <div className={styles.flex}>
                    <p>{senderPrivateBetUser.user.username}</p>
                    <p>Your bet: {myPrivateBetUser.amount}</p>
                    <p>Pot: {bet.pot}</p>
                  </div>
                  <div>
                    <p>
                      Win condition: {winner.firstName} {winner.lastName} defeats{" "}
                      {loser.firstName} {loser.lastName}
                    </p>
                  </div>
                  <div className={styles.actions}>
                    <i
                      onClick={(event) => onAcceptBet(event, myPrivateBetUser)}
                      className={`fa-solid fa-check ${styles.accept}`}
                    ></i>
                    <i
                      onClick={(event) => onDeclineBet(event, myPrivateBetUser)}
                      className={`fa-solid fa-xmark ${styles.decline}`}
                    ></i>
                  </div>
                </Card>
              </li>
            );
          } else {
            const senderPrivateBetUser = bet.privateBetUsers.find(
              (pb) => pb.userId !== userCtx.user.id
            );
            const myPrivateBetUser = bet.privateBetUsers.find(
              (pb) => pb.userId === userCtx.user.id
            );
            let winner = myPrivateBetUser.matchAthlete.athlete;
            let loser = myPrivateBetUser.matchAthlete.match.athletes.find(
              (a) => a.id !== winner.id
            );
            let result = null;
            if (myPrivateBetUser.matchAthlete.result !== null) {
              if (myPrivateBetUser.desiredResult) {
                result = myPrivateBetUser.matchAthlete.result;
              } else {
                result = !myPrivateBetUser.matchAthlete.result;
              }
            }
            if (!myPrivateBetUser.desiredResult) {
              loser = myPrivateBetUser.matchAthlete.match.athletes.find(
                (a) => a.id === myPrivateBetUser.matchAthlete.athlete.id
              );
              winner = myPrivateBetUser.matchAthlete.match.athletes.find(
                (a) => a.id !== loser.id
              );
            }
            return (
              <li key={bet.id}>
                <Card className={styles.privateBets}>
                  <div className={styles.flex}>
                    <p>{senderPrivateBetUser.user.username}</p>
                    <p>Your bet: {myPrivateBetUser.amount}</p>
                    <p>Pot: {bet.pot}</p>
                  </div>
                  <div>
                    {result !== null && (result ? <h4>WON</h4> : <h4>LOST</h4>)}
                    {result === null && (
                      <p>
                        Win condition: {winner.firstName} {winner.lastName}{" "}
                        defeats {loser.firstName} {loser.lastName}
                      </p>
                    )}
                  </div>
                </Card>
              </li>
            );
          }
        })}
      </ul>
    );
  }

  const setAllHandler = () => {
    setViewPrivateBets(false);
    setAll(true);
    setComplete(false);
    setIncomplete(false);
    setPrivateBets(false);
  };

  const setCompleteHandler = () => {
    setViewPrivateBets(false);
    setAll(false);
    setComplete(true);
    setIncomplete(false);
    setPrivateBets(false);
  };

  const setIncompleteHandler = () => {
    setViewPrivateBets(false);
    setAll(false);
    setComplete(false);
    setIncomplete(true);
    setPrivateBets(false);
  };

  const setPrivateBetsHandler = () => {
    setAll(false);
    setComplete(false);
    setIncomplete(false);
    setPrivateBets(true);
    setViewPrivateBets(false);
  };

  const setViewPrivateBetsHandler = () => {
    setAll(false);
    setComplete(false);
    setIncomplete(false);
    setPrivateBets(false);
    setViewPrivateBets(true);
  };

  return (
    <Modal className={styles.modal} onClick={props.onClick}>
      <h2>Your Bets</h2>
      <div className={styles.filters}>
        <h3
          onClick={setIncompleteHandler}
          className={incomplete ? styles.active : ""}
        >
          Active
        </h3>
        <h3
          onClick={setCompleteHandler}
          className={complete ? styles.active : ""}
        >
          Complete
        </h3>
        <h3 onClick={setAllHandler} className={all ? styles.active : ""}>
          All
        </h3>
        <h3
          onClick={setPrivateBetsHandler}
          className={privateBets ? styles.active : ""}
        >
          Requests
        </h3>
        <h3
          onClick={setViewPrivateBetsHandler}
          className={viewPrivateBets ? styles.active : ""}
        >
          Private Bets
        </h3>
      </div>
      {list}
    </Modal>
  );
};

export default UserBets;
