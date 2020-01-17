import React from 'react';
import Node from './NodeElement.js';

function Row(props) {
  return (
    <div className="Row">
      {props.node.map((node, i) => {
        return <Node key={i} node={node} start={props.start} end={props.end} mouse={props.mouse} />
      })}
    </div>
  );
}

export default Row;
