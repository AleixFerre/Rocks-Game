// Code by Aleix Ferre
// I grabbed this game idea from some random youtube video I don't remember honestly
// I just tried to replicate it ;)

let resolution = 50; // mida de cada cel·la
let quantitat = 10; // Quantitat de quadrats a l'escena
let mida = resolution * quantitat; // mida de tot el canvas

let roboto;

let initPlayer = {
    x: 3,
    y: 3
};

let player = JSON.parse(JSON.stringify(initPlayer));


let finish = false; // Has the game finished?
let win = false; // Did you won?

let secondsInit = 10; // Copia dels segons inicials
let seconds = secondsInit; // Segons per completar el nivell

let initRocks = [ // Array of coords of the rocks
    {
        x: 4,
        y: 4
    },
    {
        x: 2,
        y: 4
    },
    {
        x: 5,
        y: 6
    },
];

let rocks = [...initRocks];

let final = {
    x: 5,
    y: 7
};

// Cada valor pot ser:
//  -> 0  --  buit
//  -> 1  --  paret
//  -> 2  --  pedra (es pot moure)
//  -> 3  --  final
//  -> 4  --  jugador
let grid = []; // Vector de 1D per la matriu 2D del mapa

let chars = ["_", "[ ]", "O", "F", "ö"]; // Array de correspondencia amb els valors

let p;
let restartBtn;

function preload() {
    roboto = loadFont("Roboto-Black.ttf");
}

function setup() {
    textFont(roboto);

    p = createP();
    restartBtn = createButton("Restart");
    restartBtn.mouseClicked(restart);

    createCanvas(mida, mida);
    makeGrid();
}

function draw() {
    background(0);

    if (finish) {

        translate(width / 2, height / 2);

        fill(255);
        textAlign(CENTER);
        textSize(32);

        if (win) {
            text("YOU WON! :D", 0, 0);
        } else {
            text("YOU LOST! :(", 0, 0);
        }
    } else {

        let s = seconds - floor(millis() / 1000);
        s = constrain(s, 0, seconds);
        p.html("Remaining time: " + s + "s");

        if (s <= 0) {
            finish = true;
            win = false;
        }

        translate(resolution / 2, resolution / 2);

        textSize(22);
        fill(255);
        textAlign(CENTER);

        for (let i = 0; i < quantitat; i++) {
            for (let j = 0; j < quantitat; j++) {
                text(chars[grid[i + j * quantitat].toString()], i * resolution, j * resolution);
            }
        }
    }
}

function makeGrid() {
    for (let i = 0; i < quantitat; i++) {
        for (let j = 0; j < quantitat; j++) {
            if (i === 0 || j === 0 || i === quantitat - 1 || j === quantitat - 1) {
                grid[i + j * quantitat] = 1;
            } else if (i === player.x && j === player.y) {
                grid[i + j * quantitat] = 4;
            } else if (i === final.x && j === final.y) {
                grid[i + j * quantitat] = 3;
            } else if (hiHaPedra(i, j)) {
                grid[i + j * quantitat] = 2;
            } else {
                grid[i + j * quantitat] = 0;
            }
        }
    }
}

function hiHaPedra(x, y) {
    // Retorna si hi ha una pedra en aquell lloc
    for (let i = 0; i < rocks.length; i++) {
        if (rocks[i].x === x && rocks[i].y === y) {
            return true;
        }
    }
    return false;
}

function movePlayer(x, y) {

    let desiredX = player.x + x;
    let desiredY = player.y + y;

    let front = queHiHa(desiredX, desiredY)

    if (front === 1 || front === 3) {
        // Si hi ha una paret, fora
        return;
    }

    if (queHiHa(desiredX, desiredY) === 2) {
        mourePedra(desiredX, desiredY, x, y);
        return;
    }

    // Si no pasa res extrany, moure el jugador a la posició indicada

    grid[player.x + player.y * quantitat] = 0;

    player.x = desiredX;
    player.y = desiredY;

    grid[player.x + player.y * quantitat] = 4;
}

function queHiHa(x, y) {
    return grid[x + y * quantitat];
}

function mourePedra(rx, ry, x, y) {

    let desiredX = rx + x;
    let desiredY = ry + y;

    let next = queHiHa(desiredX, desiredY);

    if (next === 1 || next === 2) {
        return;
    } else if (next === 3) {
        print("You won! :D");
        win = true;
        finish = true;
        return;
    }

    // Si no hi ha res davant de la roca...
    // Movem al jugador
    grid[rx + ry * quantitat] = 4;
    grid[player.x + player.y * quantitat] = 0;

    player.x += x;
    player.y += y;

    // Movem la roca
    grid[desiredX + desiredY * quantitat] = 2;
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        movePlayer(0, -1);
    } else if (keyCode === DOWN_ARROW) {
        movePlayer(0, 1);
    } else if (keyCode === LEFT_ARROW) {
        movePlayer(-1, 0);
    } else if (keyCode === RIGHT_ARROW) {
        movePlayer(1, 0);
    }
}

function restart() {

    print(player, initPlayer);

    player = JSON.parse(JSON.stringify(initPlayer));
    rocks = initRocks;

    makeGrid();

    finish = false;
    won = false;

    if (finish) {
        seconds += floor(millis() / 1000);
    } else {
        seconds = secondsInit + floor(millis() / 1000);
    }
}