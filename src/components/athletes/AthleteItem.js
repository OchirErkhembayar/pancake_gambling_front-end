import React, { useState } from "react";

import styles from "./AthleteItem.module.css";

import Card from "../UI/Card";
import AthleteModal from "./AthleteModal";

const AthleteItem = (props) => {
  const [hiddenModal, setHiddenModal] = useState(true);

  const showModalHandler = () => {
    setHiddenModal(false);
  };

  const hideModalHandler = () => {
    setHiddenModal(true);
  };

  return (
    <React.Fragment>
      {!hiddenModal && (
        <AthleteModal onClick={hideModalHandler} athlete={props.athlete} />
      )}
      <Card className={styles['athlete-item']} onClick={showModalHandler}>
        <h2>{`${props.athlete.firstName} "${props.athlete.nickName}" ${props.athlete.lastName}`}</h2>
      </Card>
    </React.Fragment>
  );
};

export default AthleteItem;
