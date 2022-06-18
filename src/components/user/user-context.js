import React, { useState, useEffect } from 'react'

import useHttp from '../../hooks/use-http';

const UserContext = React.createContext({
  user: {},
  onAddPancakes: (amount) => {},
  onRemovePancakes: (amount) => {},
  onAddBet: () => {}
});

export const UserContextProvider = (props) => {
  const [user, setUser] = useState({});

  const { sendRequest: fetchUser } = useHttp();

  useEffect(() => {
    const transformUser = (userObj) => {
      setUser(userObj.user);
    };

    fetchUser(
      {
        url: `http://localhost:8000/auth/get-user/2`
      },
      transformUser
    );
  }, [fetchUser])

  const addBetHandler = (bet) => {
    setUser(prevState => {
      return {
        ...prevState,
        bets: prevState.bets.concat(bet)
      }
    })
  }

  const addPancakesHandler = (amount) => {
    setUser(prevState => {
      return {
        ...prevState,
        balance: prevState.balance + amount
      }
    })
  }

  const removePancakesHandler = (amount) => {
    setUser(prevState => {
      console.log(prevState)
      return {
        ...prevState,
        balance: prevState.balance - amount
      }
    });
  }

  return (
    <UserContext.Provider
      value={{
        user: user,
        onAddPancakes: addPancakesHandler,
        onRemovePancakes: removePancakesHandler,
        onAddBet: addBetHandler
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext
