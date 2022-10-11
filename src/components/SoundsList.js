import React, { Fragment, useRef, useState } from "react";

import Sound from "./Sound";

const SoundsList = (props) => {
  const [title, setTitle] = useState(null);
  const [previews, setPreviews] = useState(null);
  const audioRef = useRef();

  const updateSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const soundPlayHandler = (title, previews) => {
    setTitle(title);
    setPreviews(previews);
    updateSong();
  };

  return (
    <div className="mx-auto w-6/12">
      <ul>
        {props.sounds.map((sound) => (
          <Sound
            key={sound.id}
            title={sound.title}
            previews={sound.previews}
            soundPlayer={soundPlayHandler}
          />
        ))}
      </ul>
      <button className="mr-10" onClick={props.prev} disabled={props.isLoading}>
        &lt;
      </button>
      <button onClick={props.next} disabled={props.isLoading}>
        &gt;
      </button>
      {title && <p className="font-mono mt-10">Now playing: {title}</p>}
      {previews && (
        <audio className="font-mono mt-5" controls autoPlay ref={audioRef}>
          {Object.keys(previews).map((key) => (
            <source key={key} src={previews[key]} />
          ))}
        </audio>
      )}
    </div>
  );
};

export default SoundsList;
