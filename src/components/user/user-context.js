import React, { useState, useEffect } from 'react'

import useHttp from '../../hooks/use-http';

const UserContext = React.createContext({
  user: {},
  login: (token) => {},
  logout: () => {},
  token: '',
  loggedIn: false,
  onAddPancakes: (amount) => {},
  onRemovePancakes: (amount) => {},
  onAddBet: () => {}
});

export const UserContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState({id: localStorage.getItem('userId')} || {});

  let userLoggedIn = !!token;

  const loginHandler = (userObj) => {
    setUser({
      id: userObj.userId
    });
    setToken(userObj.token);
    localStorage.setItem('token', userObj.token);
    localStorage.setItem('userId', userObj.userId);
  }

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser({});
    setToken(null);
  }

  const { sendRequest: fetchUser } = useHttp();

  useEffect(() => {
    const transformUser = (userObj) => {
      setUser(userObj.user);
    };
    if (userLoggedIn && !user.username) {
      fetchUser(
        {
          url: `https://pancake-gambling-backend.herokuapp/auth/get-user/${user.id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        },
        transformUser
      );
    }
  }, [fetchUser, userLoggedIn, user, token])

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
        token: token,
        login: loginHandler,
        logout: logoutHandler,
        loggedIn: !!user.username,
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
