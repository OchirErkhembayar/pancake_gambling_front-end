import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import Card from "../UI/Card";
import Button from "../UI/Button";
import styles from "./AuthForm.module.css";
import UserContext from "../user/user-context";

import useHttp from "../../hooks/use-http";

const isNotEmpty = (value) => value.trim() !== "";

const AuthForm = () => {
  const [signup, setSignup] = useState(false);

  const [formValidity, setFormValidity] = useState({
    username: true,
    password: true,
    confirmPassword: true,
    email: true,
  });

  const usernameRef = useRef();
  const confirmPasswordRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef();
  const history = useHistory();
  const userCtx = useContext(UserContext);
  const {
    isLoading: loginLoading,
    error: loginError,
    sendRequest: fetchLogin,
  } = useHttp();
  const {
    isLoading: signupLoading,
    error: signupError,
    sendRequest: fetchSignup,
  } = useHttp();

  const loginHandler = (event) => {
    event.preventDefault();
    const transformUser = (userObj) => {
      userCtx.login(userObj);
      history.goBack();
    };

    const enteredUsername = usernameRef.current.value;
    const enteredPassword = passwordRef.current.value;

    const enteredUsernameIsValid = isNotEmpty(enteredUsername);
    const enteredPasswordIsValid = isNotEmpty(enteredPassword);

    setFormValidity({
      username: enteredUsernameIsValid,
      password: enteredPasswordIsValid,
    });

    const formIsValid = enteredUsernameIsValid && enteredPasswordIsValid;

    if (!formIsValid) {
      console.log("Form not valid");
      return;
    }

    fetchLogin(
      {
        url: `${process.env.REACT_APP_URL}/auth/login`,
        body: {
          username: enteredUsername.toLowerCase(),
          password: enteredPassword,
        },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      transformUser
    );

    usernameRef.current.value = "";
    passwordRef.current.value = "";
  };

  const signupHandler = (event) => {
    event.preventDefault();
    const transformUser = (userObj) => {
      userCtx.login(userObj);
      history.goBack();
    };

    const enteredUsername = usernameRef.current.value;
    const enteredPassword = passwordRef.current.value;
    const enteredConfirmPassword = confirmPasswordRef.current.value;
    const enteredEmail = emailRef.current.value;

    const enteredUsernameIsValid = isNotEmpty(enteredUsername);
    const enteredPasswordIsValid = isNotEmpty(enteredPassword);
    const enteredConfirmPasswordIsValid = isNotEmpty(enteredConfirmPassword);
    const enteredEmailIsValid = isNotEmpty(enteredEmail);

    setFormValidity({
      username: enteredUsernameIsValid,
      password: enteredPasswordIsValid,
      confirmPassword: enteredConfirmPasswordIsValid,
      email: enteredEmailIsValid,
    });

    const formIsValid =
      enteredUsernameIsValid &&
      enteredPasswordIsValid &&
      enteredConfirmPasswordIsValid &&
      enteredEmailIsValid;

    if (!formIsValid) {
      console.log("Form not valid");
      return;
    }

    fetchSignup(
      {
        url: `${process.env.REACT_APP_URL}/auth/signup`,
        body: {
          username: enteredUsername.toLowerCase(),
          password: enteredPassword,
          confirmedPassword: enteredConfirmPassword,
          email: enteredEmail,
        },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      transformUser
    );
  };

  const usernameClasses =
    !formValidity.username || loginError
      ? styles["form-control"] + " invalid"
      : styles["form-control"];
  const passwordClasses =
    !formValidity.password || loginError
      ? styles["form-control"] + " invalid"
      : styles["form-control"];
  const confirmPasswordClasses =
    !formValidity.password || loginError
      ? styles["form-control"] + " invalid"
      : styles["form-control"];
  const emailClasses =
    !formValidity.password || loginError
      ? styles["form-control"] + " invalid"
      : styles["form-control"];

  if (loginError) {
    console.log(loginError);
  }

  if (signupError) {
    console.log(signupError, "Signup Error");
  }

  if (loginLoading) {
    return (
      <Card className={styles.card}>
        <p>Logging in...</p>
      </Card>
    );
  }

  if (signupLoading) {
    return (
      <Card className={styles.card}>
        <p>Creating account...</p>
      </Card>
    );
  }

  return (
    <Card className={styles.card}>
      {loginError && (
        <p className={styles.error}>Incorrect username or password</p>
      )}
      {signupError && (
        <p className={styles.error}>
          {signupError}
        </p>
      )}
      <form className={styles.form}>
        <div>
          <div className={usernameClasses}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" ref={usernameRef} />
            {!formValidity.username && (
              <p className={styles["empty-fields"]}>Please enter a username</p>
            )}
          </div>
          <div className={passwordClasses}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={passwordRef} />
            {!formValidity.password && (
              <p className={styles["empty-fields"]}>Please enter a password</p>
            )}
          </div>
          {signup && (
            <React.Fragment>
              <div className={confirmPasswordClasses}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  ref={confirmPasswordRef}
                />
                {!formValidity.confirmPassword && (
                  <p className={styles["empty-fields"]}>
                    Please enter a password
                  </p>
                )}
              </div>
              <div className={emailClasses}>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" ref={emailRef} />
                {!formValidity.email && (
                  <p className={styles["empty-fields"]}>
                    Please enter an email
                  </p>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="form-actions">
          {!signup && (
            <Button onClick={loginHandler} className={styles.button}>
              Login
            </Button>
          )}
          {signup && (
            <Button onClick={signupHandler} className={styles.button}>
              Sign up
            </Button>
          )}
        </div>
      </form>
      {!signup && (
        <Button
          className={styles.switch}
          onClick={() => {
            setSignup(true);
          }}
        >
          Sign up
        </Button>
      )}
      {signup && (
        <Button
          className={styles.switch}
          onClick={() => {
            setSignup(false);
          }}
        >
          Login
        </Button>
      )}
      <Button
        className={styles.cancel}
        onClick={() => {
          history.goBack();
        }}
      >
        Cancel
      </Button>
    </Card>
  );
};

export default AuthForm;
