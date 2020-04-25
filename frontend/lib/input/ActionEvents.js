/*
 * Kaos
 * Copyright (C) 2020 Brian Sutherland (bsuth)
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

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

export const MENU_ACTION_EVENTS = Object.freeze({
    MOVE_X: 'menu-move-x',
    MOVE_Y: 'menu-move-y',
    MOVE_UP: { action: 'menu-move-y', payload: { axis: -1 }, },
    MOVE_DOWN: { action: 'menu-move-y', payload: { axis: 1 }, },
    MOVE_RIGHT: { action: 'menu-move-x', payload: { axis: 1 }, },
    MOVE_LEFT: { action: 'menu-move-x', payload: { axis: -1 }, },
    ACCEPT: 'menu-accept',
    BACK: 'menu-back',
    MODE_PREV: 'menu-mode-prev',
    MODE_NEXT: 'menu-mode-next',
});

export const GAME_ACTION_EVENTS = Object.freeze({
    MOVE_X: 'game-move-x',
    MOVE_Y: 'game-move-y',
    MOVE_UP: { action: 'game-move-x', payload: { axis: 1 }, },
    MOVE_DOWN: { action: 'game-move-x', payload: { axis: -1 }, },
    MOVE_RIGHT: { action: 'game-move-y', payload: { axis: 1 }, },
    MOVE_LEFT: { action: 'game-move-y', payload: { axis: -1 }, },
    ROTATE: 'game-rotate',
    ROTATE_CC: 'game-rotate-cc',
    RED: 'game-red',
    PURPLE: 'game-purple',
    GREEN: 'game-green',
    CYAN: 'game-cyan',
    CYCLE_COLOR: 'game-cycle-color',
    PAUSE: 'game-pause',
});

export const CONTEXTS = Object.freeze({
    MENU: MENU_ACTION_EVENTS,
    GAME: GAME_ACTION_EVENTS,
});


// -----------------------------------------------------------------------------
// STATE
// -----------------------------------------------------------------------------

let _activeActions = {};
let _currentContext = 'MENU';


// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

export function getContext()
{
    return _currentContext;
}

export function changeContext(context)
{
    context = context.toUpperCase();

    if (context in CONTEXTS)
        if (context != _currentContext)
            _currentContext = context;
}

export function registerAction(id, action, payload)
{
    if (typeof action === 'object')
        ({ action, payload } = action);

    if (action in _activeActions) {
        if (!(id in _activeActions[action]))
            _activeActions[action][id] = true;
    } else {
        window.dispatchEvent(new CustomEvent(`${action}-start`, {
            detail: payload,
        }));

        _activeActions[action] = { [id]: true };
    }
}

export function unregisterAction(id, action, payload)
{
    if (typeof action === 'object')
        ({ action, payload } = action);

    if (!(action in _activeActions)) return;
    if (!(id in _activeActions[action])) return;

    delete _activeActions[action][id];

    if (Object.keys(_activeActions[action]).length === 0) {
        delete _activeActions[action];

        window.dispatchEvent(new CustomEvent(`${action}-end`, {
            detail: payload,
        }));
    }
}
