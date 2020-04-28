/*
 * Kaos
 * Copyright (C) 2020 Brian Sutherland (bsuth) Robert Sutherland (0p3r4t0r)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as orbGenerator from './orbGenerator';
import * as player from './player';
import * as settings from './settings';
import Timed from './GameMode/Timed';
import Collector from './GameMode/Collector';
import SpinToWin from './GameMode/SpinToWin';

// -----------------------------------------------------------------------------
// GAME (GLOBALS)
// -----------------------------------------------------------------------------

export const canvas = document.getElementById('canvas');

export const ctx = canvas.getContext('2d');

// -----------------------------------------------------------------------------
// GAME LOOP
// -----------------------------------------------------------------------------

export let gameMode = new SpinToWin(new player.Player, new orbGenerator.OrbGenerator);

function gameloop(tFrame)
{
    // Count the time and award points.
    gameMode.update(tFrame);

    if (gameMode.state.gameover) {
        document.addEventListener('keydown', keydown);
        console.log('score:', gameMode.state.score);
        return;
    }

    gameMode.draw();

    requestAnimationFrame(gameloop);
}

export function restart(event)
{
    document.removeEventListener('keydown', keydown);
    gameMode.state.gameover = true;
    // delay for gameloop return.
    setTimeout(run, 20);
}

export function run()
{
    // -------------------------------------------------------------------------
    // CANVAS INIT
    // -------------------------------------------------------------------------
    resize();
    window.onresize = resize;

    gameMode.init();

    gameloop();
}

// -----------------------------------------------------------------------------
// UTILS
// -----------------------------------------------------------------------------

function keydown(e) 
{
    if (e.key in settings.KEYMAP)
        settings.ACTIONS[settings.KEYMAP[e.key]].callback();
}

function resize() 
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameMode.orbGenerator.pTopBottom = canvas.width / (canvas.width + canvas.height);
    gameMode.orbGenerator.pLeftRight = canvas.height / (canvas.width + canvas.height);
}
