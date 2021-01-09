import { Reducer } from 'redux';

// STATE
export interface GameState {
    isPause: boolean;
}

// ACTIONS
interface StartAction { type: 'GAME__START' }
interface PauseAction { type: 'GAME__PAUSE' }
interface ContinueAction { type: 'GAME__CONTINUE' }

type KnownAction = StartAction | PauseAction | ContinueAction;

// ACTION CREATORS
//for TypeScript
export interface GameAction {
    start: () => StartAction;
    pause: () => PauseAction;
    continue: () => ContinueAction;
}
export const actionCreators = {
    start: () => <StartAction>{ type: 'GAME__START' },
    pause: () => <PauseAction>{ type: 'GAME__PAUSE'},
    continue: () => <ContinueAction>{ type: 'GAME__CONTINUE'},
};

const defaultState = {
    isPause: true,
};

// REDUCER 
export const reducer: Reducer<GameState> = (state: GameState | undefined, action: KnownAction) => {
    switch (action.type) {
        case 'GAME__START':
            return defaultState;
        case 'GAME__PAUSE':
            return Object.assign({}, state, { isPause: true });
        case 'GAME__CONTINUE':
            return Object.assign({}, state, { isPause: false });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || defaultState;
};
