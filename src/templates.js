const about = () => {
    return `
    Tetrjs is a Tetris clone written in JavaScript.
    <br />
    <br />
    Tetrjs was written by
    <a href="https://destinmoulton.com" target="_blank">Destin Moulton</a>.
    <br />
    <br />
    Available on
    <a href="https://github.com/destinmoulton/tetrjs" target="_blank">GitHub</a>.
    <br />
    Open source under the
    <a href="https://en.wikipedia.org/wiki/MIT_License">MIT License</a>.
    <br />
    <br />
    <button type="button" id="tetrjs-about-close">Resume Game</button>
`;
};

const container = () => {
    return `
    <!-- The Game Container -->
    <div id="tetrjs-container">
        <div id="tetrjs-title-container">Tetrjs</div>
        <div id="tetrjs-board-wrapper"><div id="tetrjs-board"></div></div>
        <div id="tetrjs-next-piece-preview-container"></div>
        <div id="tetrjs-score-container"></div>
        <div id="tetrjs-level-container"></div>
        <div id="tetrjs-actions-container">
            <br />
            <button id="tetrjs-button-pause">
                <div class="icon">&#9613;&#9613;</div>
                <div class="button-text">Pause</div>
            </button>
            <br />
            <br />
            <button id="tetrjs-button-new">New Game</button>
            <br />
            <br />
            <button id="tetrjs-button-about">
                About Tetrjs
            </button>
        </div>
        <div id="tetrjs-modal-veil"></div>
        <div id="tetrjs-modal"></div>
    </div>
`;
};

const gameover = ({ score, rowsEliminated, level }) => {
    return `
    Game Over! <br /><br />
    <table border="0" id="tetrjs-gameover-table">
        <tbody>
            <tr>
                <td><strong>Score:</strong></td>
                <td>${score}</td>
            </tr>
            <tr>
                <td><strong>Lines:</strong></td>
                <td>${rowsEliminated}</td>
            </tr>
            <tr>
                <td><strong>Level:</strong></td>
                <td>${level}</td>
            </tr>
        </tbody>
    </table>
    <br />
    <button id="tetrjs-gameover-newgame">New Game</button>
`;
};

const intro = () => {
    return `
    <button type="button" id="tetrjs-intro-newgame">
        <span>▶</span>&nbsp;&nbsp;Play Tetrjs!
    </button>

    <br /><br />
    Arrow keys control the pieces.
`;
};

const paused = () => {
    return `
    Paused...
    <br />
    <br />
    <button type="button" id="tetrjs-pause-play">
        <span class="">▶</span>&nbsp;&nbsp;Resume
    </button>
    <br />
    <br />Tip: Press <b>P</b> key to pause/resume.
`;
};

export default {
    about,
    container,
    gameover,
    intro,
    paused
};
