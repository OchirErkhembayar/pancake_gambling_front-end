import React, { useState, useContext } from "react";

import Navbar from "./components/UI/Navbar";
import Footer from "./components/UI/Footer";
import Banner from "./components/UI/Banner";
import Matches from "./components/matches/Matches";
// import Leaderboard from "./components/leaderboard/Leaderboard";
// import useHttp from "./hooks/use-http";
import UserContext from "./components/user/user-context";

function App() {
  const userCtx = useContext(UserContext);

  const [banner, setBanner] = useState(true);

  const noBannerHandler = () => {
    setBanner(false);
  }

  return (
    <React.Fragment>
      <Navbar user={userCtx.user} />
      {!banner && <Matches />}
      {banner && <Banner onNoBanner={noBannerHandler}/>}
      <Footer />
    </React.Fragment>
  );
}

export default App;
