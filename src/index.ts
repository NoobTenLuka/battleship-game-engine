const makeFalseArray = (length: number) => {
  const array = [];
  for (let index = 0; index < length; index++) {
    array.push(false);
  }

  return array;
}

export class BattleGame {
  board: Board;
  hitArray: boolean[][];

  constructor(width: number, height: number) {
    this.hitArray = Array.from(Array(width), () => Array(height));
    this.board = new Board(width, height);
  }

  shoot = (x: number, y: number) => {
    if (x < 0 || x > this.board.width || y < 0 || y > this.board.height) return;

    if (this.board.map[x][y]) {
      this.hitArray[x][y] = true;

      this.board.ships.forEach((ship: { x: any[]; y: any[]; }) => {
        const xI = ship.x.findIndex(shipX => shipX === x);
        const yI = ship.y.findIndex(shipY => shipY === y);
        if (xI === -1 || yI === -1) return;

        ship.x[xI] = -1;
        ship.y[yI] = -1;

        ship.x.reduce((prev, val) => {
          if (prev + val === -(ship.x.length)) {
            this.board.shipsLeft--;
            return 10;
          }

          return prev + val;
        })
      })

      return {
        hasHit: true,
        fullMap: this.board.map,
        shipsLeft: this.board.shipsLeft,
        hitArray: this.hitArray
      }
    }

    this.hitArray[x][y] = false;

    return {
      hasHit: false,
      fullMap: this.board.map,
      shipsLeft: this.board.shipsLeft,
      hitArray: this.hitArray
    }
  }
}

export class Board {
  map: boolean[][]; //This is the playing field
  width;
  height;
  ships: Ship[] = [];
  shipsLeft = 3;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.map = Array.from(Array(width), () => makeFalseArray(height)); // Initialise the playing field with an twodimensional, empty array of width * height

    this.placeShips();
  }

  placeShips = () => {
    let shipsPlaced = {
      length2: false,
      length3: false,
      length4: false
    };

    while (!shipsPlaced.length2 || !shipsPlaced.length3 || !shipsPlaced.length4) {
      if (!shipsPlaced.length2) {
        shipsPlaced.length2 = this.placeShip(2)
      }

      if (!shipsPlaced.length3) {
        shipsPlaced.length3 = this.placeShip(3)
      }

      if (!shipsPlaced.length4) {
        shipsPlaced.length4 = this.placeShip(4)
      }
    }
  }

  placeShip = (length: number) => {
    let layout = Math.round(Math.random());
    let direction = Math.round(Math.random());
    let randomX = Math.floor(Math.random() * this.width);
    let randomY = Math.floor(Math.random() * this.height);
    let ship: {x: number[], y: number[]} = {
      x: [],
      y: []
    }
    for (let i = 0; i < length; i++) {
      let x = direction === 0 ? randomX + i : randomX - i;
      let y = direction === 0 ? randomY + i : randomY - i;
      if (this.map[layout === 0 ? x : randomX] === undefined || this.map[layout === 0 ? x : randomX][layout === 1 ? y : randomY] !== false) {
        return false;
      }
      ship.x.push(layout === 0 ? x : randomX);
      ship.y.push(layout === 1 ? y : randomY)
    }
    ship.x.forEach((x, index) => {
      this.map[x][ship.y[index]] = true;
    });
    this.ships.push(ship);
    return true;
  }
}

interface Ship {
  x: number[],
  y: number[]
}