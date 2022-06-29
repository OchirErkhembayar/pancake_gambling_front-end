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
  addFriend: () => {},
  addFriendLoading: false,
  acceptFriend: () => {},
  acceptFriendLoading: false,
  declineFriend: () => {},
  declineFriendLoading: false,
  deleteFriend: () => {},
  deleteFriendLoading: false,
  isLoading: false,
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

  const { isLoading: addLoading, sendRequest: fetchAddFriend } = useHttp();

  const { isLoading: acceptingLoading, sendRequest: fetchAcceptRequest } = useHttp();

  const { isLoading: decliningLoading, sendRequest: fetchDeclineRequest } = useHttp();

  const { isLoading: deletingLoading, sendRequest: fetchDeleteFriend } = useHttp();

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
      return {
        ...prevState,
        balance: prevState.balance - amount
      }
    });
  }

  const addFriendHandler = (id) => {
    const transformFriends = (friendObj) => {
      const newFriends = [...user.friends];
      newFriends.push(friendObj.friend);
      setUser({
        ...user,
        friends: newFriends
      });
    }

    fetchAddFriend(
      {
        url: `${process.env.REACT_APP_URL}/friend/send-request`,
        body: {
          friendId: id
        },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
      transformFriends
    );
  }

  const acceptFriendRequestHandler = (ufId) => {
    const transformFriends = (friendObj) => {
      const friends = [...user.friends];
      const index = friends.findIndex(f => f.id === friendObj.friend.id);
      friends[index].accepted = true;
      setUser({
        ...user,
        friends: friends
      });
    }

    fetchAcceptRequest(
      {
        url: `${process.env.REACT_APP_URL}/friend/accept`,
        body: {
          userFriendId: ufId
        },
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
      transformFriends
    );
  }

  const declineFriend = (id) => {
    const transformFriends = (friendObj) => {
      const friends = [...user.friends];
      const index = friends.findIndex(f => f.id === friendObj.friend.id);
      if (index > -1) {
        friends.splice(index, 1);
      }
      setUser({
        ...user,
        friends: friends
      });
    }

    fetchDeclineRequest(
      {
        url: `${process.env.REACT_APP_URL}/friend/decline`,
        body: {
          userFriendId: id
        },
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
      transformFriends
    );
  }

  const deleteFriendHandler = (id) => {
    const transformFriends = (friendObj) => {
      const friends = [...user.friends];
      const index = friends.findIndex(f => f.id === friendObj.friend.id);
      if (index > -1) {
        friends.splice(index, 1);
      }
      setUser({
        ...user,
        friends: friends
      });
    }

    fetchDeleteFriend(
      {
        url: `${process.env.REACT_APP_URL}/friend/delete`,
        body: {
          userFriendId: id
        },
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
      transformFriends
    );
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
        onAddBet: addBetHandler,
        addFriend: addFriendHandler,
        addFriendLoading: addLoading,
        acceptFriend: acceptFriendRequestHandler,
        acceptFriendLoading: acceptingLoading,
        declineFriend: declineFriend,
        declineFriendLoading: decliningLoading,
        deleteFriend: deleteFriendHandler,
        deleteFriendLoading: deletingLoading
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext
