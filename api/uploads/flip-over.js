// ;(() => {

/* DOM ELEMENTS */
const throwbutton     = document.querySelector('#roll');
const calculation     = document.querySelector('#calculation');
const die1            = document.querySelector('#die1');
const die2            = document.querySelector('#die2');
const errorfield      = document.querySelector('#errorfield');
const rollresults     = document.querySelector('#rollresults');
const playersection   = document.querySelector('#players');
const addplayerbutton = document.querySelector('#addplayer');
const playerform      = document.querySelector('#playerlist');
const playername      = document.querySelector('#playername');
const restartbutton   = document.querySelector('#newgame');
const gamescreen      = document.querySelector('#game');
const creditscreen    = document.querySelector('#credits');
const introscreen     = document.querySelector('#intro');
const gameoverscreen  = document.querySelector('#gameover');
const flipoptions     = document.querySelector('#checkboxes');
const turnmessage     = document.querySelector('#turnmessage')

let config = {};
let currentplayer = 0;
let players = localStorage.flipoverplayercache ?  JSON.parse(localStorage.flipoverplayercache) : [];

const init = () => {
    restartbutton.addEventListener('click', setupgame);
    throwbutton.addEventListener('click', rollthem);
    addplayerbutton.addEventListener('click', toggleplayerform);
    playerform.addEventListener('submit', addplayer);
    playerform.querySelector('ul').addEventListener('click', removeplayer);
    setuptextscreens([
        ['intro', introscreen],
        ['credits', creditscreen]
    ]);
    fetch('gameconfig.json').then(function(response) {
        return response.text();
      }).then(function(text) {
        config = JSON.parse(text);
        setupgame();
    });
}

/* Player controls */
const addplayer = (ev) => {
    ev.preventDefault();
    if (playername.value !== '') {
        players.push(
            {"name": playername.value, "score": 0}
        );
        playername.value = '';
        playername.classList.remove('show');
        populateplayers(currentplayer);
    }
};

const removeplayer = (ev) => {
    let t = ev.target;
    if (t.tagName === "A" && t.parentNode.tagName === 'LI') {
        let deadplayer = players.splice(t.dataset.num, 1);
        populateplayers(currentplayer);
    }
    ev.preventDefault();
}

const toggleplayerform = (ev) => {
    playername.classList.toggle('show');
    playername.focus();
}

const populateplayers = (turn) => {
    localStorage.playercache = JSON.stringify(players);
    playerform.querySelector('ul').innerHTML = '';
    players.forEach((p, k) => {
        let list =  document.querySelector('#playerlist ul');
        let item = document.createElement('li');
        if (k === turn) {
            item.classList.add('currentplayer');
        }
        item.dataset.num = k;
        item.dataset.score = '0';
        item.innerHTML= `
            ${p.name}:
            <span>${p.score}</span>
            <a data-num="${k}"href="#">x</a>
        `;
        list.appendChild(item);
    });
    if (players.length > 0) {
        addplayerbutton.classList.add('compact');
        addplayerbutton.innerHTML = config.labels.buttons.addplayercompact;
    }   else {
        addplayerbutton.classList.remove('compact');
        addplayerbutton.innerHTML = config.labels.buttons.addplayerfull;
    }     
};

const advanceplayers = () => {
    if (players.length > 0) {
        if (players[currentplayer].score >= config.gameendscore) {
            gameover();
        } else {
            currentplayer = (currentplayer + 1) % players.length;
            throwbutton.innerHTML = players[currentplayer].name + ', roll the dice!';
            populateplayers(currentplayer);
       }
    }
}


const rollthem = (ev) => {
    let valueone = throwdice();
    let valuetwo = throwdice();
    die1.title = die1.dataset.val = valueone;
    die2.title = die2.dataset.val = valuetwo;
    die1.className = `dice dice-${valueone}`;
    die2.className = `dice dice-${valuetwo}`;
    throwbutton.className = 'hidden';
    rollresults.className = '';
    errorfield.className = 'hidden';
    paintflipoptions(valueone + valuetwo);
    ev.preventDefault();
};

const gameover = () => {
    setsection(gameoverscreen);
    let playerscore = players.slice(0);
    playerscore.sort((a,b) => {
        return a.score > b.score
    });
    let out = '';
    playerscore.forEach((p) => {
        out += `<li>${p.name}: ${p.score}</li>`;
    });
    gameoverscreen.querySelector('ol').innerHTML = out;
}

/* HELPER FUNCTIONS */

const clearmove = () => {
    errorfield.innerHTML = '';
    errorfield.classList.add('hidden');
    die1.classList.remove('selected');
    die2.classList.remove('selected');
}

const setsection = (stateid) => {
    [gameoverscreen, gamescreen, introscreen, creditscreen].forEach(s => {
        s.classList.add('hidden');
    });
    stateid.classList.remove('hidden');
}
const setupgame = (ev) => {
    players.forEach(p => {
        p.score = 0;
    });
    currentplayer = 0;
    populateplayers(currentplayer);
    [throwbutton, playersection].forEach(s => {
        s.classList.remove('hidden');
    })
    errorfield.classList.add('hidden');
    rollresults.classList.add('hidden');
    errorfield.innerHTML = '';
    throwbutton.innerHTML = players.length > 0 ?
        config.labels.buttons.multiplayerroll.replace(
            '$name', players[currentplayer].name
        ): 
        config.labels.buttons.singleplayerroll;
    setsection(gamescreen);
    paintflipoptions();
    if (ev) {ev.preventDefault()}
};

const paintflipoptions = (num) => {
    var out = ''
    for(let i = 1; i < 13; i += 1) {
        out += `<button class="${(i>num)?'nope':''}" data-val="${i}">${i}</button>`;
    }
    flipoptions.innerHTML = out;
}


const setuptextscreens = (screendata) => {
    screendata.forEach((s) => {
        document.querySelector('a[href="#' + s[0] +  '"]').addEventListener('click', (ev) => {
            ev.preventDefault();
            setsection(s[1]);
        });
        document.querySelector('#' + s[0] + ' button').addEventListener('click', (ev) => {
            ev.preventDefault();
            setsection(gamescreen);
        });
    });
};

const throwdice = () => {
    return ~~(Math.random() * 6) + 1;
}

window.addEventListener('DOMContentLoaded', init);

// })();
