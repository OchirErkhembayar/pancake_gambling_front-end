import React from 'react'

import styles from "./Banner.module.css";

import Button from './Button';

const Banner = (props) => {
  return (
    <div className={styles.banner}>
      <h1>Pancake Gambling</h1>
      <Button onClick={props.onNoBanner}>See matches</Button>
    </div>
  )
}

export default Banner
