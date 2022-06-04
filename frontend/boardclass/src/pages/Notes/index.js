import React, { useEffect, useRef, useState } from "react";
import { LayoutBody } from "../../layout";
import bodyImg from "./images/noteImg.png";
import titleIcon from "./images/noteicon.png";
import lineTitle from "./images/lineTitle.png";
import Alert from "react-popup-alert";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import mic from "../../assets/mic-white.png";
import Globals from "../../global/Globals";
import api from "../../services/api";
import styles from "../Home/home.module.css";
import { format } from "date-fns";

export const Notes = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const microphoneRef = useRef(null);

  const [note, setNote] = useState("");

  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [alert, setAlert] = useState({
    type: "warning",
    text: "alert message",
    show: false,
  });

  useEffect(() => {
    const note = () => {
      if (
        text.includes("criar") ||
        text.includes("anotação") ||
        text.includes("nota") ||
        text.includes("cadastrar") ||
        text.includes("escrever") ||
        text.includes("salvar")
      ) {
        handleCreateNote();
      }
    };

    note();
  }, [text]);

  const handleCreateNote = async () => {
    if (note === "") {
      onShowAlert("warning", 0);
    } else {
      try {
        await api.post("notes", {
          note,
          date: format(new Date(), "dd/MM/yy"),
        });

        setTimeout(() => {
          onShowAlert("warning", 2);
          setTimeout(() => {
            window.location.href = "/Help";
          }, 3000);
        }, 1000);
      } catch (e) {
        onShowAlert("warning", 14);
      }
    }
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="notSupportContainer">
        Browser is not Support Speech Recognition.
      </div>
    );
  }

  const handleListening = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };

  const stopListening = () => {
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
    setIsListening(false);
    resetTranscript();
    if (text) {
      setText("");
      setText(transcript);
    } else {
      setText(transcript);
    }
    resetTranscript();
  };

  function onCloseAlert(help) {
    setAlert({
      type: "",
      text: "",
      show: false,
    });
  }

  function onShowAlert(type, index) {
    setAlert({
      type: type,
      text: Globals.messages[index].message,
      show: true,
    });
  }

  return (
    <LayoutBody>
      <div className="titles">
        <div className="title">
          <img src={titleIcon} alt=""></img>
          <img src={lineTitle} alt=""></img>
          <span>Anotação</span>
        </div>
        <div className={styles.alertContainer2}>
          <Alert
            header={""}
            btnText={"Entendi :)"}
            text={alert.text}
            type={alert.type}
            show={alert.show}
            onClosePress={onCloseAlert}
            pressCloseOnOutsideClick={true}
            showBorderBottom={true}
            alertStyles={{
              height: 160,
              width: 200,
              backgroundColor: "#1ABBBB",
              padding: 15,
              borderRadius: 15,
              border: 0,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            headerStyles={{
              display: "none",
            }}
            textStyles={{
              textAlign: "center",
              fontSize: 14,
              fontWeight: "300",
              fontFamily: "sans-serif",
              color: "#FFFFFF",
              padding: 0,
            }}
            buttonStyles={{
              textAlign: "center",
              paddingTop: 10,
              paddingBottom: 10,
              paddingRight: 15,
              paddingLeft: 15,
              fontSize: 14,
              fontWeight: "600",
              fontFamily: "sans-serif",
              color: "#FFFFFF",
              borderRadius: 10,
              textDecoration: "none",
            }}
          />
        </div>
        <div className="subTitle">
          <span>Digite sua anotação no campo abaixo: </span>
        </div>
      </div>

      <div className="containerInput">
        <div className="forms">
          <br></br>
          <div className="rowInput">
            <input
              className="disciplineInput"
              onChange={(e) => setNote(e.target.value)}
              value={note}
              placeholder={"Anotação: "}
            />
          </div>
          <br></br>
          <button
            className="loading"
            ref={microphoneRef}
            onClick={isListening ? stopListening : handleListening}
          >
            {(isListening && <button className={styles.stopButton} />) || (
              <img alt="button" className="micImg" src={mic}></img>
            )}
          </button>
        </div>

        <div className="bodyImg">
          <img src={bodyImg} alt=""></img>
        </div>
      </div>
    </LayoutBody>
  );
};
