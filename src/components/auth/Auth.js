import React from 'react'
import AuthForm from './AuthForm';

import styles from "./Auth.module.css";

const Auth = (props) => {
  return (
    <div className={styles.auth}>
      <AuthForm hideLoginPage={props.hideLoginPage} />
    </div>
  )
}

export default Auth
