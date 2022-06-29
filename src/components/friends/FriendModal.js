import React from 'react'

import styles from "./FriendModal.module.css";

import Modal from '../UI/Modal';

const FriendModal = (props) => {
  return (
    <Modal className={styles.modal} onClick={props.onClick}>{props.friend.username}</Modal>
  )
}

export default FriendModal
