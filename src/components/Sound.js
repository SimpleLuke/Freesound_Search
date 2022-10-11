import React from "react";

const Sound = (props) => {
  return (
    <li>
      <a
        href="?"
        onClick={() => props.soundPlayer(props.title, props.previews)}
      >
        {props.title}
      </a>
    </li>
  );
};

export default Sound;
