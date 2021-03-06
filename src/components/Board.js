import React, { useState } from "react";
import Row from "./Row";
import Player from "./Player";
import MyContext from "../MyContext";

import "../css/Board.css";

const Board = (props) => {
  const [rows, setRows] = useState([
    [{ cell: 1 }, { cell: 2 }, { cell: 3 }],
    [{ cell: 1 }, { cell: 2 }, { cell: 3 }],
    [{ cell: 1 }, { cell: 2 }, { cell: 3 }],
  ]);
  const [currPlayer, setCurrPlayer] = useState(1);
  const [gameStatus, setGameStatus] = useState("");
  const [isGame, setIsGame] = useState(true);
  const [winner, setWinner] = useState("");

  const changePlayer = () => {
    const temp = currPlayer;
    if (temp === 1) {
      setCurrPlayer(2);
    } else {
      setCurrPlayer(1);
    }
  };

  const addPlayerCell = (rowNum, cellNum) => {
    const allRows = rows;
    const row = allRows[rowNum];
    const cell = row.find((x) => x.cell === cellNum);
    cell.player = currPlayer;
    setRows(allRows);

    //check diagonal
    if (
      //check middle cell
      allRows[1].find((x) => x.cell === 2 && x.player === currPlayer) &&
      //check 3 rows with same player cells
      allRows.filter((row) => row.some((x) => x.player === currPlayer))
        .length === allRows.length
    ) {
      if (
        //check one diagonal
        allRows[0].find((x) => x.cell === 1 && x.player === currPlayer) &&
        allRows[2].find((x) => x.cell === 3 && x.player === currPlayer)
      ) {
        stopGame();
        const cell1 = allRows[0].find((x) => x.cell === 1);
        cell1.check = true;
        const cell2 = allRows[1].find((x) => x.cell === 2);
        cell2.check = true;
        const cell3 = allRows[2].find((x) => x.cell === 3);
        cell3.check = true;
        setRows(allRows);
        playerWon();
        return;
      }

      //check second diagonal
      if (
        allRows[0].find((x) => x.cell === 3 && x.player === currPlayer) &&
        allRows[2].find((x) => x.cell === 1 && x.player === currPlayer)
      ) {
        stopGame();
        const cell3 = allRows[0].find((x) => x.cell === 3);
        cell3.check = true;
        const cell2 = allRows[1].find((x) => x.cell === 2);
        cell2.check = true;
        const cell1 = allRows[2].find((x) => x.cell === 1);
        cell1.check = true;
        playerWon();
        return;
      }
    }

    //check row
    if (row.every((x) => x.player === currPlayer)) {
      stopGame();
      row.forEach((cell) => {
        cell.check = true;
      });
      setRows(allRows);
      playerWon();
      return;
    }

    //check column
    if (
      allRows.every((row) =>
        row.find((x) => x.cell === cellNum && x.player === currPlayer)
      )
    ) {
      allRows.forEach((row) => {
        const cells = row.filter(
          (x) => x.cell === cellNum && x.player === currPlayer
        );
        cells.map((cell) => (cell.check = true));
      });
      setRows(allRows);
      stopGame();
      playerWon();
      return;
    }

    //check draw
    if (allRows.every((row) => row.every((cell) => cell.player))) {
      stopGame();
      setGameStatus("It's a draw!");
      setWinner("");
      setTimeout(() => {
        alert("It's a draw!");
      }, 0.2);
      return;
    }

    ///keep playing
    else {
      changePlayer();
    }
  };

  ///finish game
  const stopGame = () => {
    setIsGame(false);
  };

  ///winner
  const playerWon = async () => {
    await setWinner(currPlayer);
    setGameStatus(`Player ${winner} is the winner!`);
  };

  ///renew game
  const restartGame = () => {
    setRows([
      [{ cell: 1 }, { cell: 2 }, { cell: 3 }],
      [{ cell: 1 }, { cell: 2 }, { cell: 3 }],
      [{ cell: 1 }, { cell: 2 }, { cell: 3 }],
    ]);
    setCurrPlayer(1);
    setIsGame(true);
    setGameStatus("");
    setWinner("");
  };

  ///make rows
  const renderRows = () => {
    let rowsArr = [];
    rows.forEach((row, index) =>
      rowsArr.push(
        <Row
          key={index}
          rowNum={index}
          rowData={row}
          addPlayerCell={(rowNum, cellNum) => addPlayerCell(rowNum, cellNum)}
        />
      )
    );
    return rowsArr;
  };

  const backToMain = () => {
    props.history.push("/main");
  };

  return (
    <MyContext.Provider
      value={{
        currPlayer: currPlayer,
        isGame: isGame,
      }}>
      <div className='board-wrapper'>
        <div className='container container-game'>
          <div className='board-buttons'>
            <input
              type='button'
              value={gameStatus ? "New Game" : "Reset Game"}
              onClick={() => restartGame()}
            />

            <input
              type='button'
              value='New Players'
              onClick={() => backToMain()}
            />
          </div>

          <div className='container-board-players'>
            <Player
              className='player'
              playerNum={1}
              icon={sessionStorage["player1"]}
              winner={winner}
            />
            <div className='board'>{renderRows()} </div>
            <Player
              className='player'
              playerNum={2}
              icon={sessionStorage["player2"]}
              winner={winner}
            />
          </div>
        </div>
      </div>
      <footer>
        <span className='footer-span'>Created by @Anael-dev</span>
        <a
          className='footer-link'
          href='https://www.linkedin.com/in/anael-mashinsky/'
          target='_blank'
          rel='noopener noreferrer'>
          <i className='fab fa-linkedin-in'></i>
        </a>
        <br />
        <a
          className='footer-link'
          href='https://github.com/Anael-dev'
          target='_blank'
          rel='noopener noreferrer'>
          <i className='fab fa-github'></i>
        </a>
      </footer>
    </MyContext.Provider>
  );
};

export default Board;
