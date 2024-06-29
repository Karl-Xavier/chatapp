import React, { useState, useEffect, useRef, useContext } from 'react';
import './compStyles/MsgInput.css';
import { PaperclipHorizontal, PaperPlaneTilt, Smiley, Microphone, Stop } from 'phosphor-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../config/firebase.config';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const MsgInput = () => {
  const { currentUser } = useContext(AuthContext);
  const { data: chatData } = useContext(ChatContext);
  const [showPicker, setShowPicker] = useState(false);
  const [messageValue, setMessageValue] = useState('');
  const [imgValue, setImgValue] = useState(null);
  const [audioValue, setAudioValue] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const sendMessage = async (content) => {
    const { messageValue, imgValue, audioValue } = content;

    // Ensure there is at least one non-empty content value
    if (!messageValue && !imgValue && !audioValue) return;

    const messageData = {
      id: uuid(),
      senderId: currentUser.uid,
      date: Timestamp.now(),
    };

    if (messageValue) {
      messageData.messageValue = messageValue;
    }
    if (imgValue) {
      messageData.imgValue = imgValue;
    }
    if (audioValue) {
      messageData.audioValue = audioValue;
    }

    await updateDoc(doc(db, 'chat', chatData.chatId), {
      messages: arrayUnion(messageData),
    });

    const lastMessageText = messageValue || (imgValue ? 'Image' : 'Audio');

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [`${chatData.chatId}.lastMessage`]: {
        text: lastMessageText,
      },
      [`${chatData.chatId}.date`]: serverTimestamp(),
    });
    await updateDoc(doc(db, 'userChats', chatData.user.uid), {
      [`${chatData.chatId}.lastMessage`]: {
        text: lastMessageText,
      },
      [`${chatData.chatId}.date`]: serverTimestamp(),
    });
  };

  const handleSendText = async () => {
    if (messageValue.trim()) {
      await sendMessage({ messageValue });
      setMessageValue('');
    }
  };

  const handleSendImage = async (img) => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      const imgURL = await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.log(error.message);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });

      await sendMessage({ imgValue: imgURL });
      setImgValue(null);
    }
  };

  const handleSendAudio = async (audio) => {
    if (audio) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, audio);
      const audioURL = await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.log(error.message);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });

      await sendMessage({ audioValue: audioURL });
      setAudioValue(null);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      await handleSendAudio(audioBlob);
      audioChunksRef.current = [];
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleEmojiSelect = (emoji) => {
    setMessageValue((prev) => prev + emoji.native);
    setShowPicker(false);
  };

  const pickerRef = useRef();

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='absolute bottom-0 inputbox'>
      <Smiley color={'#01070e'} onClick={() => setShowPicker(!showPicker)} className='smile' size={42} />
      {showPicker && (
        <div ref={pickerRef}>
          <Picker data={data} onEmojiSelect={handleEmojiSelect} emojiSize={20} />
        </div>
      )}
      <input
        type="text"
        placeholder='Type a Message....'
        value={messageValue}
        onChange={(e) => setMessageValue(e.target.value)}
      />
      <div className="sendactions">
        <input
          style={{ display: 'none' }}
          type="file"
          name="attach"
          id="attach"
          onChange={(e) => handleSendImage(e.target.files[0])}
        />
        <label htmlFor="attach">
          <PaperclipHorizontal size={32} color={'#01070e'} />
        </label>
        <button onClick={handleSendText} type='send'>
          <PaperPlaneTilt size={32} weight='fill' color={'#01070e'} />
        </button>
        {isRecording ? (
          <button onClick={stopRecording}><Stop weight='fill' color='#df4646' size={32} /></button>
        ) : (
          <button onClick={startRecording}>
            <Microphone size={32} weight='fill' color={'#01070e'} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MsgInput;
