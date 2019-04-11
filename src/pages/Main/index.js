import React, { useState } from "react";
import api from "../../services/api";

import logo from "../../assets/logo.svg";
import "./styles.css";

export default function Main(props) {
  const [boxName, setBoxName] = useState("");

  function handleBoxNameChange(e) {
    setBoxName(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await api.post("boxes", {
      title: boxName
    });

    props.history.push(`/box/${response.data._id}`);
  }

  return (
    <div id="main-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="" />
        <input
          placeholder="Criar um box"
          value={boxName}
          onChange={handleBoxNameChange}
        />
        <button type="submit">Criar</button>
      </form>
    </div>
  );
}
