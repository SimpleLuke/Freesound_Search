import React from "react";

const Sound = (props) => {
  return (
    <li className="font-mono">
      <a
        href="#foo"
        onClick={() => props.soundPlayer(props.title, props.previews)}
      >
        {props.title}
      </a>
    </li>
  );
};

export default Sound;
