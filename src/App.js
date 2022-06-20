import React, { useState, useContext } from "react";

import Navbar from "./components/UI/Navbar";
import Footer from "./components/UI/Footer";
import Banner from "./components/UI/Banner";
import Matches from "./components/matches/Matches";
import Auth from "./components/auth/Auth";
// import Leaderboard from "./components/leaderboard/Leaderboard";
// import useHttp from "./hooks/use-http";
import UserContext from "./components/user/user-context";

function App() {
  const userCtx = useContext(UserContext);

  const [banner, setBanner] = useState(true);
  const [loginPage, setLoginPage] = useState(false);

  const noBannerHandler = () => {
    setBanner(false);
  }

  const showBannerHandler = () => {
    setBanner(true);
  }

  const onLoginPage = () => {
    setLoginPage(true);
  }

  const hideLoginPage = () => {
    setLoginPage(false);
  }

  return (
    <React.Fragment>
      <Navbar user={userCtx.user} loginPage={loginPage} showBanner={showBannerHandler} hideLoginPage={hideLoginPage} showLoginPage={onLoginPage} />
      {!banner && !loginPage && <Matches />}
      {banner && !loginPage && <Banner onNoBanner={noBannerHandler}/>}
      {!userCtx.loggedIn && loginPage && <Auth hideLoginPage={hideLoginPage} />}
      <Footer />
    </React.Fragment>
  );
}

export default App;
