import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import useInput from "../../hooks/use-input";
import Card from "../UI/Card";
import Button from "../UI/Button";
import styles from "./AuthForm.module.css";
import UserContext from "../user/user-context";

import useHttp from "../../hooks/use-http";

const isNotEmpty = (value) => value.trim() !== '';

const AuthForm = (props) => {
  const history = useHistory();
  const userCtx = useContext(UserContext);
  const { isLoading, error, sendRequest: fetchLogin } = useHttp();

  const {
    value: usernameValue,
    isValid: usernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsername,
  } = useInput(isNotEmpty);
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput(isNotEmpty);

  let formIsValid = false;

  if (usernameIsValid && passwordIsValid) {
    formIsValid = true;
  }

  const submitHandler = event => {
    event.preventDefault();
    const transformUser = (userObj) => {
      userCtx.login(userObj);
      history.push("/");
    };

    if (!formIsValid) {
      return;
    }

    fetchLogin(
      {
        url: `${process.env.REACT_APP_URL}/auth/login`,
        body: {
          username: usernameValue.toLowerCase(),
          password: passwordValue
        },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      transformUser
    )

    resetUsername();
    resetPassword();
  };

  const usernameClasses = usernameHasError || error ? styles['form-control'] + ' invalid' : styles['form-control'];
  const passwordClasses = passwordHasError || error ? styles['form-control'] + ' invalid' : styles['form-control'];

  if (isLoading) {
    return (
      <Card className={styles.card}>
        <p>Loading...</p>
      </Card>
    )
  }

  return (
    <Card className={styles.card}>
      <form onSubmit={submitHandler}>
        <div>
          <div className={usernameClasses}>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              id='username'
              value={usernameValue}
              onChange={usernameChangeHandler}
              onBlur={usernameBlurHandler}
            />
            {/* {usernameHasError && <p className="error-text">Please enter a username.</p>} */}
          </div>
          <div className={passwordClasses}>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              value={passwordValue}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
            />
            {/* {passwordHasError && <p className="error-text">Please enter a password.</p>} */}
          </div>
        </div>
        <div className='form-actions'>
          {!isLoading && <Button className={styles.button} disabled={!formIsValid}>Login</Button>}
          {isLoading && <Button className={styles.button} disabled={true}>Logging in...</Button>}
        </div>
      </form>
      <Link to="/"><Button className={styles.cancel} onClick={props.hideLoginPage}>Cancel</Button></Link>
    </Card>
  );
};

export default AuthForm;
