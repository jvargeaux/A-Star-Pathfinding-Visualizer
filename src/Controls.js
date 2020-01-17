import React from 'react';

function Controls(props) {
  function clickWall() {
    return props.clicked('wall');
  }
  function clickStart() {
    return props.clicked('start');
  }
  function clickEnd() {
    return props.clicked('end');
  }

  return (
    <div className="Controls">
      <button className={props.mode === 'wall' ? "activated" : ""} onClick={clickWall}>Place Walls</button>
      <button className={props.mode === 'start' ? "activated" : ""} onClick={clickStart}>Place Start Node</button>
      <button className={props.mode === 'end' ? "activated" : ""} onClick={clickEnd}>Place End Node</button>
    </div>
  );
}

export default Controls;
