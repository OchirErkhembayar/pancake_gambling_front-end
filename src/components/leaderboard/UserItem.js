import React from 'react'

const UserItem = (props) => {
  return (
    <div>{props.user.username} - {props.user.balance} pancakes</div>
  )
}

export default UserItem
