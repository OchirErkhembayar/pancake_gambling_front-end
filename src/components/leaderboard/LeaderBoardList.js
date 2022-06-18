import React from 'react'

import styles from "./LeaderBoardList.module.css"

import UserItem from './UserItem'

const LeaderBoardList = (props) => {
  let userList = <h2>No users found.</h2>;

  if (props.users.length > 0) {
    userList = (
      <div className={styles['user-list']}>
        {props.users.map(user => {
          return <UserItem user={user} key={user.id} />
        })}
      </div>
    );
  }

  let content = userList;

  if (props.error) {
    content = <button onClick={props.onFetch}>Try again</button>;
  }

  if (props.loading) {
    content = 'Loading users...';
  }

  return content
}

export default LeaderBoardList
