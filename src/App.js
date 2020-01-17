import React, { useState } from 'react';
import Grid from './Grid.js';
import Controls from './Controls.js';

// Macros
const sizeX = 50;
const sizeY = 50;
const start = [18, 24];
const end = [35, 26];
const speed = 2;


// Init Grid
const initRows = new Array(sizeY);

for (let i = 0; i < initRows.length; i++) {
  initRows[i] = new Array(sizeX);
}

for (let y = 0; y < sizeY; y++) {
  for (let x = 0; x < sizeX; x++) {
    initRows[y][x] = {
      posX: x,
      posY: y,
      visited: false,
      currentPath: false,
      finalPath: false,
      traversable: true,
      parent: [],
      gCost: 0,
      hCost: 0,
      fCost: 0
    };
  }
}


function App() {
  // State
  const [rows, setRows] = useState(initRows);
  const [mode, setMode] = useState('wall');
  const [startNode, setStartNode] = useState(start);
  const [endNode, setEndNode] = useState(end);

  // [mouseIsDragging, createWalls(aka pathIsTraversable)]
  const [dragging, setDragging] = useState([false, true]);

  function clearedGrid(removeWalls) {
    const grid = rows;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j].visited = false;
        grid[i][j].open = false;
        grid[i][j].hCost = 0;
        grid[i][j].gCost = 0;
        grid[i][j].fCost = 0;
        grid[i][j].currentPath = false;
        grid[i][j].finalPath = false;
        grid[i][j].parent = [];
        if (removeWalls) {
          grid[i][j].traversable = true;
        }
      }
    }

    return grid;
  }

  function resetGrid() {
    const freshGrid = clearedGrid(true);
    updateState(freshGrid);
  }

  function resetPath() {
    const freshGrid = clearedGrid(false);
    updateState(freshGrid);
  }

  // UPDATE STATE
  // Initialize entirely new empty grid in order to update state
  function updateState(updatedArray) {
    const newRows = new Array(rows.length);
    for (let h = 0; h < newRows.length; h++) {
      newRows[h] = new Array(rows[h].length);
    }

    // Populate grid with brand new objects
    for (let i = 0; i < newRows.length; i++) {
      for (let j = 0; j < newRows[i].length; j++) {
        // Copy values into new array
        newRows[i][j] = updatedArray[i][j];
      }
    }

    setRows(newRows);
  }

  function controlClicked(type) {
    if (type === 'wall') {
      setMode('wall');
    }
    else if (type === 'start') {
      setMode('start');
    }
    else if (type === 'end') {
      setMode('end');
    }
  }

  function mouse(eventType, x, y) {
    const newGrid = rows;
    if (mode === 'wall') {
      if (posAreSame(startNode, [x, y]) || posAreSame(endNode, [x, y])) {
        // do nothing
      }
      else {
        if (eventType === 'down') {
          // start dragging
          // if it's traversable (not a wall), createWalls = true
          // if it's untraversable (a wall), createWalls = false
          setDragging([true, newGrid[y][x].traversable]);
          newGrid[y][x].traversable = !newGrid[y][x].traversable;
          updateState(newGrid);
        }
        else if (eventType === 'enter') {
          if (dragging[0]) {
            // if creating walls
            if (dragging[1]) {
              newGrid[y][x].traversable = false;
            }
            // if not creating walls (destroying walls)
            else {
              newGrid[y][x].traversable = true;
            }
            updateState(newGrid);
          }
        }
        else if (eventType === 'up') {
          // stop dragging, keep createWalls value (which is set on down)
          setDragging([false, dragging[1]]);
        }
      }
    }
    else if (mode === 'start' && eventType === 'click') {
      setStartNode([x, y]);
      resetPath();
      updateState(newGrid);
    }
    else if (mode === 'end' && eventType === 'click') {
      setEndNode([x, y]);
      resetPath();
      updateState(newGrid);
    }
  }

  function posAreSame(pos1, pos2) {
    if (pos1 && pos2) {
      let areSame = true;
      if (pos1[0] !== pos2[0]) { // X
        areSame = false;
      }
      if (pos1[1] !== pos2[1]) { // Y
        areSame = false;
      }
      return areSame;
    }
    else {
      return 0;
    }
  }

  function A_star() {

    const grid = clearedGrid(false);

    var counter = 0;
    const originNode = grid[startNode[1]][startNode[0]];
    const targetNode = grid[endNode[1]][endNode[0]];

    // Algorithm
    var OPEN = [];
    var CLOSED = [];
    OPEN.push(originNode);

    const loop = () => {
      setTimeout(() => {

        // ALGORITHM LOOP

        // if (counter >= 30) {
        //   return;
        // }

        var cIndex = getIndexOfLowestFCost(OPEN);
        var currentNode = OPEN[cIndex];
        if (!currentNode) {
          return;
        }
        OPEN.splice(cIndex, 1);
        currentNode.hCost = distance(currentNode, targetNode);
        currentNode.gCost = distance(currentNode, originNode);
        currentNode.currentPath = true;

        CLOSED.push(currentNode);

        if (currentNode === targetNode) {
          const backTrackingPath = [];
          var backTrackingNode = currentNode.parent;
          if (backTrackingNode) {
            while (!posAreSame(backTrackingNode, originNode)) {
              backTrackingPath.push([backTrackingNode[1], backTrackingNode[0]]);
              grid[backTrackingNode[1]][backTrackingNode[0]].finalPath = true;
              backTrackingNode = grid[backTrackingNode[1]][backTrackingNode[0]].parent;
            }
          }
          console.log(backTrackingPath);

          updateState(grid);
          return;
        }

        let neighborNodes = getNeighbors(currentNode, rows);
        neighborNodes.forEach(neighborNode => {
          let isInClosed = CLOSED.find(nodeInClosed => nodeInClosed === neighborNode);
          if (neighborNode.traversable && !isInClosed) {
            neighborNode.visited = true;
            neighborNode.parent = [currentNode.posX, currentNode.posY];
            neighborNode.gCost = currentNode.gCost + distance(neighborNode, currentNode);
            let isInOpen = OPEN.find(nodeInOpen => nodeInOpen === neighborNode);
            if (distance(neighborNode, originNode) < currentNode.gCost || !isInOpen) { // better path
              neighborNode.hCost = distance(neighborNode, targetNode);
              neighborNode.fCost = neighborNode.hCost + neighborNode.gCost;
              OPEN.push(neighborNode);
            }
          }
        });

        if (!OPEN) {
          console.log("Failed.");
          return;
        }

        updateState(grid);
        counter++;
        loop();

      }, speed);
    }
    loop();
  }

  function distance(node1, node2) {
    const d = Math.sqrt(Math.pow((node1.posX - node2.posX), 2) + Math.pow((node1.posY - node2.posY), 2));

    return Math.round(d * 10);
  }

  function getIndexOfLowestFCost(openArray) {
    const fCosts = [];
    openArray.forEach(node => {
      fCosts.push(node.fCost);
    });

    const lowestFCost = Math.min(...fCosts);
    return fCosts.indexOf(lowestFCost);
  }

  function getNeighbors(node, grid) {
    if (!node) {
      return [];
    }
    const neighbors = [];
    // Left
    if (node.posX > 0) {
      neighbors.push(grid[node.posY][node.posX - 1]);
    }
    // Right
    if (node.posX < (grid[0].length - 1)) {
      neighbors.push(grid[node.posY][node.posX + 1]);
    }
    // Up
    if (node.posY > 0) {
      neighbors.push(grid[node.posY - 1][node.posX]);
    }
    // Down
    if (node.posY < (grid.length - 1)) {
      neighbors.push(grid[node.posY + 1][node.posX]);
    }
    // Left/Up
    if (node.posX > 0 && node.posY > 0) {
      neighbors.push(grid[node.posY - 1][node.posX - 1]);
    }
    // Right/Up
    if (node.posX < (grid[0].length - 1) && node.posY > 0) {
      neighbors.push(grid[node.posY - 1][node.posX + 1]);
    }
    // Left/Down
    if (node.posX > 0 && node.posY < (grid.length - 1)) {
      neighbors.push(grid[node.posY + 1][node.posX - 1]);
    }
    // Right/Down
    if (node.posX < (grid[0].length - 1) && node.posY < (grid.length - 1)) {
      neighbors.push(grid[node.posY + 1][node.posX + 1]);
    }
    return neighbors;
  }

  return (
    <div className="App">
      <Controls clicked={controlClicked} mode={mode} />
      <button onClick={A_star}>Hey</button>
      <button onClick={resetGrid}>Reset</button>
      <Grid rows={rows} start={startNode} end={endNode} mouse={mouse} />
    </div>
  );
}

export default App;
