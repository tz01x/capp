import { useEffect, useState } from "react";
import { collection, DocumentSnapshot, onSnapshot } from "firebase/firestore";

export default function Chatroom(props) {
  const [msg, stateMsg] = useState();

  useEffect(() => {
    props.loadData(props.chatroomid);
    const unsub = onSnapshot(
      collection(props.db, props.chatroomid),
      (querySnapshot) => {
        let listofdata = [];
        querySnapshot.forEach(function (doc) {
          // console.log(doc.data());
          listofdata.push(doc.data());
        });
        props.stateMydata([...listofdata]);
      }
    );
  }, []);

  let msginputHendeler = (e) => {
    stateMsg(e.target.value);
  };
  function handelSendmessage() {
    props.addData(props.chatroomid, msg, props.uid);
    stateMsg("");
  }

  return (
    <div className="container">
      <div className="roomnav">
        <button
          onClick={() => {
            props.cleared_room();
          }}
        >
          back
        </button>
        <h4 className="roomtitle">
          Room <small> {props.chatroomid}</small>{" "}
        </h4>
      </div>
      <div className="displaymsg">
        {props.mydata.map((val) => {
          if (val.uid === props.uid) {
            return (
              <div className="msg mymsg">
                {val.msg}
                <br />
                <small>
                  <small>
                    <small>me</small>
                  </small>
                </small>
              </div>
            );
          } else {
            return (
              <div className="msg othermsg">
                {val.msg}
                <br />
                <small>
                  <small>
                    <small>unknown</small>
                  </small>
                </small>
              </div>
            );
          }
        })}
      </div>
      <div className="msgbox">
        <input
          type="text"
          className="inputmsg"
          name="msginput"
          value={msg}
          onChange={msginputHendeler}
        />
        <input type="submit" onClick={handelSendmessage} value="send" />
      </div>
    </div>
  );
}
