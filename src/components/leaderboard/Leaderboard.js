import React, { useState, useEffect } from 'react'
import useHttp from '../../hooks/use-http';

import styles from "./Leaderboard.module.css";

import LeaderBoardList from './LeaderBoardList';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  const { isLoading, error, sendRequest: fetchUsers } = useHttp();

  useEffect(() => {
    const transformUsers = (userObj) => {
      setUsers(userObj.topUsers);
    };

    fetchUsers(
      { url: 'https://pancake-gambling-backend.herokuapp/auth/top'},
      transformUsers
    )
  }, [fetchUsers])

  return (
    <LeaderBoardList isLoading={isLoading} error={error} users={users} />
  )
}

export default Leaderboard
