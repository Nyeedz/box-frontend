import React, { useState, useEffect } from "react";
import { MdInsertDriveFile } from "react-icons/md";
import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";
import DropZone from "react-dropzone";
import logo from "../../assets/logo.svg";
import "./styles.css";
import api from "../../services/api";

import socket from "socket.io-client";
const io = socket("https://boxnode-backend.herokuapp.com");

export default function Box(props) {
  const box = useFetchDataApi(props.match.params.id);
  useSocket(box);

  function handleUpload(files) {
    files.forEach(file => {
      const data = new FormData();
      data.append("file", file);

      api.post(`boxes/${box._id}/files`, data);
    });
  }

  return (
    <div id="box-container">
      <header>
        <img src={logo} alt="" />
        <h1>{box.title}</h1>
      </header>

      <DropZone onDropAccepted={handleUpload}>
        {({ getRootProps, getInputProps }) => (
          <div className="upload" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Arraste arquivos ou clique aqui</p>
          </div>
        )}
      </DropZone>

      <ul>
        {box.files &&
          box.files.map(file => (
            <li key={file._id}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="fileInfo"
              >
                <MdInsertDriveFile size={24} color="#A5Cfff" />
                <strong>{file.title}</strong>
              </a>

              <span>
                há {distanceInWords(file.createdAt, new Date(), { locale: pt })}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

function useSocket(box) {
  const [inRoom] = useState(false);
  useEffect(() => {
    if (inRoom) {
      console.log("entrou na sala");
      io.emit("connectRoom", box._id);
    }
    return () => {
      if (inRoom) {
        io.emit("disconect", { room: "teste-room" });
      }
    };
  });
}

function useFetchDataApi(props) {
  const [box, dataSet] = useState("");
  let didCancel = false;

  async function fetchData() {
    const response = await api.get(`boxes/${props}`);
    if (!didCancel) {
      dataSet(response.data);
    }
  }

  useEffect(() => {
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [props, box]);

  return box;
}
