import React, { useRef, useContext, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./MatchModal.module.css";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import UserContext from "../user/user-context";

const MatchModal = (props) => {
  const userCtx = useContext(UserContext);
  const enteredAthlete = useRef();
  const enteredFriend = useRef();
  const friendRef = useRef();
  const theirAmount = useRef();
  const { error, isLoading, sendRequest: createBet } = useHttp();
  const [privateBet, setPrivateBet] = useState(false);

  const togglePrivateBet = () => {
    setPrivateBet((prev) => !prev);
  };

  const {
    value: enteredAmount,
    isValid: enteredAmountIsValid,
    // hasError: amountInputHasError,
    valueChangeHandler: amountChangedHandler,
    inputBlurHandler: amountBlurHandler,
    reset: resetAmountInput,
  } = useInput((value) => {
    return value > 0 && value <= userCtx.user.balance;
  });

  let formIsValid = false;

  if (enteredAmountIsValid) {
    formIsValid = true;
  }

  const onSubmitBetHandler = (e) => {
    e.preventDefault();
    if (!enteredAmountIsValid) {
      return;
    }
    const transformUser = (betObj) => {
      props.onClick();
      userCtx.onRemovePancakes(betObj.bet.amount);
      userCtx.onAddBet(betObj.bet);
    };

    createBet(
      {
        url: `${process.env.REACT_APP_URL}/bet/create-bet/${userCtx.user.id}/${enteredAthlete.current.value}`,
        body: {
          amount: enteredAmount,
        },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userCtx.token,
        },
      },
      transformUser
    );
    resetAmountInput();
  };

  const onSubmitPrivateBetHandler = (e) => {
    console.log(enteredAthlete.current.value, enteredFriend.current.value)
    e.preventDefault();
    if (!enteredAmountIsValid) {
      return;
    }
    const transformUser = (betObj) => {
      console.log(betObj)
      props.onClick();
      userCtx.onRemovePancakes(enteredAmount);
      // userCtx.onAddPrivateBet(betObj.privateBet);
    };

    createBet(
      {
        url: `${process.env.REACT_APP_URL}/bet/new-private-bet`,
        body: {
          myAmount: enteredAmount,
          theirAmount: theirAmount.current.value,
          matchAthleteId: enteredAthlete.current.value,
          friendId: friendRef.current.value
        },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userCtx.token,
        },
      },
      transformUser
    );
    resetAmountInput();
    theirAmount.current.value = 0;
  };

  if (!userCtx.loggedIn) {
    return (
      <Modal className={styles.modal} onClick={props.onClick}>
        <h1>{props.match.title}</h1>
        <h3>
          {props.athleteOne} ({props.athleteOneOdds}) VS {props.athleteTwo} (
          {props.athleteTwoOdds})
        </h3>
        <h3>
          <Link className={styles.link} to="/auth">
            Login
          </Link>{" "}
          to create a bet
        </h3>
      </Modal>
    );
  }

  let betInterface = Math.floor(userCtx.user.balance) > 0 && (
    <form className={styles.form}>
      <div className={styles.form__input}>
        <div>
          <label htmlFor="athlete">Athlete: </label>
          <select
            name="athlete"
            id="athlete"
            defaultValue={props.athleteOneMAId}
            ref={enteredAthlete}
          >
            <option value={props.athleteOneMAId}>{props.athleteOne}</option>
            <option value={props.athleteTwoMAId}>{props.athleteTwo}</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount">Amount: </label>
          <input
            name="amount"
            id="amount"
            type="number"
            placeholder="Enter amount here"
            step={50}
            onChange={amountChangedHandler}
            onBlur={amountBlurHandler}
            value={enteredAmount}
          />
        </div>
      </div>
      <div className={styles.form__actions}>
        {!isLoading && !error && (
          <Button
            className={styles.button}
            onClick={onSubmitBetHandler}
            type="submit"
            disabled={!formIsValid}
          >
            Make Bet
          </Button>
        )}
        {isLoading && !error && (
          <Button className={styles.button} type="submit" disabled={true}>
            Making bet...
          </Button>
        )}
        {!isLoading && error && (
          <Button className={styles.button} type="submit" disabled={true}>
            Failed to create bet. Please try again later.
          </Button>
        )}
      </div>
    </form>
  );

  if (privateBet) {
    betInterface = Math.floor(userCtx.user.balance) > 0 && (
      <form className={styles.form}>
        <div className={styles.form__input}>
          <div>
            <label htmlFor="athlete">Athlete: </label>
            <select
              name="athlete"
              id="athlete"
              defaultValue={props.athleteOneMAId}
              ref={enteredAthlete}
            >
              <option value={props.athleteOneMAId}>{props.athleteOne}</option>
              <option value={props.athleteTwoMAId}>{props.athleteTwo}</option>
            </select>
          </div>
          <div>
            <label htmlFor="athlete">Friend: </label>
            <select
              name="friend"
              id="friend"
              defaultValue={userCtx.user.friends.find(f => f.accepted)}
              ref={enteredFriend}
            >
              {userCtx.user.friends
                .filter((f) => f.accepted)
                .map((f) => {
                  return (
                    <option key={f.userId} ref={friendRef} value={f.userId}>
                      {f.user.username}
                    </option>
                  );
                })}
            </select>
          </div>
          <div>
            <label htmlFor="amount">Your Bet: </label>
            <input
              name="amount"
              id="amount"
              type="number"
              placeholder="Enter amount here"
              step={50}
              onChange={amountChangedHandler}
              onBlur={amountBlurHandler}
              value={enteredAmount}
            />
          </div>
          <div>
            <label htmlFor="amount">Their Bet: </label>
            <input
              name="their-amount"
              id="their-amount"
              type="number"
              placeholder="Enter amount here"
              step={50}
              ref={theirAmount}
            />
          </div>
        </div>
        <div className={styles.form__actions}>
          {!isLoading && !error && (
            <Button
              className={styles.button}
              onClick={onSubmitPrivateBetHandler}
              type="submit"
              disabled={!formIsValid}
            >
              Make Bet
            </Button>
          )}
          {isLoading && !error && (
            <Button className={styles.button} type="submit" disabled={true}>
              Making bet...
            </Button>
          )}
          {!isLoading && error && (
            <Button className={styles.button} type="submit" disabled={true}>
              Failed to create bet. Please try again later.
            </Button>
          )}
        </div>
      </form>
    );
  }

  return (
    <Modal className={styles.modal} onClick={props.onClick}>
      <h1>{props.match.title}</h1>
      <h3>
        {props.athleteOne} ({props.athleteOneOdds}) VS {props.athleteTwo} (
        {props.athleteTwoOdds})
      </h3>
      <Button onClick={togglePrivateBet}>
        {privateBet ? "Make normal bet" : "Make private bet"}
      </Button>
      <div className={styles.balance}>
        {userCtx.loggedIn && userCtx.user.balance >= 1 && (
          <h3>
            Create a{privateBet ? " private" : ""} bet (Balance:{" "}
            {Math.floor(userCtx.user.balance)})
          </h3>
        )}
      </div>
      {betInterface}
      {!Math.floor(userCtx.user.balance) > 0 && <p>You're out of pancakes!</p>}
      <Button className={styles.button} onClick={props.onClick}>
        Close
      </Button>
    </Modal>
  );
};

export default MatchModal;
