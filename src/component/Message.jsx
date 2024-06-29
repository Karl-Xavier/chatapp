import React, { useContext, useEffect, useRef } from 'react';
import './compStyles/Message.css';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  return (
    <div ref={ref} className={`messages mb-3 ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className="info">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="avatar" />
        <span>just now</span>
      </div>
      <div className="content">
        {message.messageValue && <p>{message.messageValue}</p>}
        {message.imgValue && <img className="img" src={message.imgValue} alt="attached" />}
        {message.audioValue && <audio className='audio' controls src={message.audioValue} />}
        {message.videoValue && (
          <video className='video' controls>
            <source src={message.videoValue} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default Message;
