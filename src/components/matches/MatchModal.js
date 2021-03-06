import React, { useRef, useContext } from "react";
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
  const { error, isLoading, sendRequest: createBet } = useHttp();

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

  const onSubmitHandler = (e) => {
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

  return (
    <Modal className={styles.modal} onClick={props.onClick}>
      <h1>{props.match.title}</h1>
      <h3>
        {props.athleteOne} ({props.athleteOneOdds}) VS {props.athleteTwo} (
        {props.athleteTwoOdds})
      </h3>
      <div className={styles.balance}>
        {userCtx.loggedIn && userCtx.user.balance >= 1 && (
          <h3>Create a bet (Balance: {Math.floor(userCtx.user.balance)})</h3>
        )}
      </div>
      {Math.floor(userCtx.user.balance) > 0 && (
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
                onClick={onSubmitHandler}
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
      )}
      {!Math.floor(userCtx.user.balance) > 0 && <p>You're out of pancakes!</p>}
      <Button className={styles.button} onClick={props.onClick}>
        Close
      </Button>
    </Modal>
  );
};

export default MatchModal;
