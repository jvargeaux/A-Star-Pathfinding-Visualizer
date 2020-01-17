import React from 'react';
import Row from './Row.js';

function Grid(props) {
  return (
    <div className="Grid">
      {props.rows.map((row, i) => {
        return <Row key={i} node={row} start={props.start} end={props.end} mouse={props.mouse} />
      })}
    </div>
  );
}

export default Grid;
