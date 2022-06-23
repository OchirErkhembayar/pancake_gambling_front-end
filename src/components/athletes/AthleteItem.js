import React from 'react'

const AthleteItem = (props) => {
  return (
    <h2>{`${props.athlete.firstName} "${props.athlete.nickName}" ${props.athlete.lastName}`}</h2>
  )
}

export default AthleteItem
