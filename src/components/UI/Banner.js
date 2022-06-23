import React from 'react'
import { Link } from "react-router-dom";

import styles from "./Banner.module.css";

import Button from './Button';

const Banner = (props) => {
  return (
    <div className={styles.banner}>
      <h1>Pancake Gambling</h1>
      <Link to="/matches"><Button onClick={props.onNoBanner}>See matches</Button></Link>
    </div>
  )
}

export default Banner
