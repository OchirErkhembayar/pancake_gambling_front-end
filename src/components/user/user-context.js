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
  onAddBet: () => {},
  isLoading: false
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
    localStorage.setItem('expiry', new Date().getTime() + 3600000)
  }

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiry');
    setUser({});
    setToken(null);
  }

  const { isLoading, sendRequest: fetchUser } = useHttp();

  useEffect(() => {
    const transformUser = (userObj) => {
      setUser(userObj.user);
    };
    if (userLoggedIn && !user.username) {
      if (new Date().getTime() > localStorage.getItem('expiry' || localStorage.getItem('token') === null || localStorage.getItem('userId') === null || localStorage.getItem('expiry') === null)) {
        return logoutHandler();
      }
      fetchUser(
        {
          url: `${process.env.REACT_APP_URL}/auth/get-user/${user.id}`,
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
        bets: prevState.bets.unshift(bet)
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
        isLoading: isLoading,
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
