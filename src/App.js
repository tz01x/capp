import "./styles.css";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  onSnapshot
} from "firebase/firestore/";

import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import Chatroom from "./Chatroom";
import { useState } from "react";
export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyA-ZDo7urli7LLerU1sKIF3Ova8XRjcHY4",
    authDomain: "testapi-c150f.firebaseapp.com",
    databaseURL: "https://testapi-c150f.firebaseio.com",
    projectId: "testapi-c150f",
    storageBucket: "testapi-c150f.appspot.com",
    messagingSenderId: "356133949031",
    appId: "1:356133949031:web:21a62c77ce33537ab64ec2",
    measurementId: "G-CWMC6EHEXX"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [uid, stateUid] = useState();
  const auth = getAuth();
  let unsub;
  const provider = new GoogleAuthProvider();
  let [chatroomid, statechatroomid] = useState("");
  const [openChatroom, stateOpenChatroom] = useState(false);
  const [mydata, stateMydata] = useState([]);
  const inputhandeler = async (e) => {
    // console.log(e.target.name);
    // const msgs = await getCities(db);
    // for (var i = 0; i < msgs.length; i++) {
    //   console.log(msgs[i]);

    // }
    // chatroomid=e.target.value;
    statechatroomid(e.target.value);
  };
  async function getCities(db) {
    const citiesCol = collection(db, "hello");
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map((doc) => doc.data());
    return cityList;
  }
  const handelSubmit = () => {
    // console.log(myinput_Data);

    // stateMydata([...mydata, myinput_Data]);
    // stateinputData("");
    if (chatroomid.length > 5) {
      stateOpenChatroom(true);
    } else {
      alert("min length is 5");
    }
  };
  const cleared_room = () => {
    stateOpenChatroom(false);
    statechatroomid("");
    stateMydata([]);
  };
  const loadData = async (id) => {
    const chatroom = collection(db, id);
    const msgSnapshot = await getDocs(chatroom);
    const msglist = msgSnapshot.docs.map((doc) => doc.data());
    stateMydata([...msglist]);
  };
  const addData = async (roomid, msg, uid) => {
    const docRef = await addDoc(collection(db, roomid), {
      msg: msg,
      uid: uid
    });
  };

  useEffect(() => {
    let val = uuidv4();
    // console.log(val);
    stateUid(val);
  }, []);

  // const [inputdata,stateinputdatea]=useState('');

  return (
    <div className="App">
      {!openChatroom ? (
        <div>
          <h1>CoolChat</h1>
          <label htmlFor="chatroomid">Chatroom-ID</label>
          <br />
          <input
            type="text"
            name="chatroomid"
            id="chatroomid"
            onChange={inputhandeler}
            value={chatroomid}
          ></input>
          <br />
          <br />
          <input type="submit" onClick={handelSubmit} />
        </div>
      ) : (
        <Chatroom
          chatroomid={chatroomid}
          addData={addData}
          loadData={loadData}
          uid={uid}
          mydata={mydata}
          stateMydata={stateMydata}
          db={db}
          cleared_room={cleared_room}
        />
      )}
    </div>
  );
}
