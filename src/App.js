import React from "react";
import { Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
// import Footer from "./components/layout/Footer";
import Banner from "./components/UI/Banner";
import Matches from "./components/pages/Matches";
import Auth from "./components/auth/Auth";
import Athletes from "./components/pages/Athletes";

function App() {

  return (
    <React.Fragment>
      <Navbar />
        <Route exact path="/">
          <Banner/>
        </Route>
        <Route path="/athletes">
          <Athletes />
        </Route>
        <Route path="/matches">
          <Matches />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
      {/* <Footer /> */}
    </React.Fragment>
  );
}

export default App;
