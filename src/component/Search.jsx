import React, { useContext, useState } from 'react';
import './compStyles/Search.css';
import { MagnifyingGlass } from 'phosphor-react';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { AuthContext } from '../context/AuthContext';

const Search = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(collection(db, 'users'), where('displayName', '==', username));
    try {
      const snapShot = await getDocs(q);
      if (snapShot.empty) {
        setErr(true);
        setUser(null);
      } else {
        snapShot.forEach((doc) => {
          setUser(doc.data());
        });
        setErr(false);
      }
    } catch (error) {
      console.log(error.message);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === 'Enter') handleSearch();
  };

  const handleSelect = async () => {
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, 'chat', combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, 'chat', combinedId), { messages: [] });
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [`${combinedId}.date`]: serverTimestamp()
        });
        await updateDoc(doc(db, 'userChats', user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [`${combinedId}.date`]: serverTimestamp()
        });
      }
      setUser(null);
      setUsername('');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container w-full my-3 search">
      <div className="container inputField w-full mb-4">
        <input
          type="text"
          placeholder="Find User With Name..."
          onKeyDown={handleKey}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSearch} className="text-white">
          <MagnifyingGlass size={25} />
        </button>
      </div>
      
      {err && <span>No User Found</span>}
      
      {user && (
        <div
          onClick={handleSelect}
          style={{ borderBottom: '1px solid grey', paddingBottom: '10px' }}
          className="findUser"
        >
          <img src={user.photoURL} alt="avatar" className="avatar" />
          <p>{user.displayName}</p>
        </div>
      )}
    </div>
  );
};

export default Search;
