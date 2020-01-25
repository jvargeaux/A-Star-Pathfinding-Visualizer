import React from 'react';

function Node(props) {

  function handleClick() {
    return props.mouse('click', props.node.posX, props.node.posY);
  }

  function handleDown() {
    return props.mouse('down', props.node.posX, props.node.posY);
  }

  function handleEnter() {
    return props.mouse('enter', props.node.posX, props.node.posY);
  }

  function handleUp() {
    return props.mouse('up', props.node.posX, props.node.posY);
  }

  function posAreSame(pos1, pos2) {
    let areSame = true;
    if (pos1[0] !== pos2[0]) { // X
      areSame = false;
    }
    if (pos1[1] !== pos2[1]) { // Y
      areSame = false;
    }
    return areSame;
  }

  const nodePos = [props.node.posX, props.node.posY];

  var colorClasses = "";
  if (props.node.discovered && !posAreSame(props.start, nodePos) && !posAreSame(props.end, nodePos)) {
    colorClasses += "discovered ";
  }
  if (props.node.currentPath) {
    colorClasses += "currentPath ";
  }
  if (props.node.finalPath) {
    colorClasses = "finalPath ";
  }
  if (posAreSame(props.start, nodePos)) {
    colorClasses = "startNode ";
  }
  if (posAreSame(props.end, nodePos)) {
    colorClasses = "endNode ";
  }
  if (props.node.currentPath && posAreSame(props.end, nodePos)) {
    colorClasses += "endNodeFinished ";
  }
  if (!props.node.traversable) {
    colorClasses = "untraversable "
  }

  return (
    // <p>{props.node.gCost} - {props.node.hCost}</p>
    // <p>{props.node.fCost}</p>
    <div className={"Node " + colorClasses}
      onClick={handleClick}
      onMouseDown={handleDown}
      onMouseEnter={handleEnter}
      onMouseUp={handleUp}>
    </div>
  );
}

export default Node;
