import { Reducer } from 'redux';

// STATE
export interface MenuState {
    isOpen: boolean;
    isDisplayButtonContinueGame: boolean;
    isDisplayButtonShop: boolean;
    isDisplayOutsideButtonMenu: boolean;
    isDisplayOutsideButtonShop: boolean;
}

// ACTIONS
interface StartAction { type: 'MENU__START' }
interface OpenAction { type: 'MENU__OPEN', isDisplayButtonContinueGame: boolean }
interface CloseAction { type: 'MENU__CLOSE' }
interface StartGameAction { type: 'MENU__START_GAME' }

type KnownAction = CloseAction | OpenAction | StartAction | StartGameAction;

// ACTION CREATORS
//for TypeScript
export interface MenuAction {
    close: () => CloseAction;
    open: (isDisplayButtonContinueGame: boolean) => OpenAction;
    openStartMenu: () => StartAction;
    startGame: () => StartGameAction;
}
export const actionCreators = {
    close: () => <CloseAction>{ type: 'MENU__CLOSE' },
    open: (isDisplayButtonContinueGame: boolean) => <OpenAction>{ type: 'MENU__OPEN', isDisplayButtonContinueGame: isDisplayButtonContinueGame},
    openStartMenu: () => <StartAction>{ type: 'MENU__START'},
    startGame: () => <StartGameAction>{ type: 'MENU__START_GAME'}
};

const defaultState = {
    isOpen: true,
    isDisplayButtonContinueGame: false,
    isDisplayButtonShop: false,
    isDisplayOutsideButtonMenu: false,
    isDisplayOutsideButtonShop: false,
};

// REDUCER 
export const reducer: Reducer<MenuState> = (state: MenuState | undefined, action: KnownAction) => {
    switch (action.type) {
        case 'MENU__START':
            return defaultState;
        case 'MENU__CLOSE':
            return Object.assign({}, state, { isOpen: false });
        case 'MENU__OPEN':
            return Object.assign({}, state, { isOpen: false, isDisplayButtonContinueGame: action.isDisplayButtonContinueGame });
        case 'MENU__START_GAME':
            return { 
                isOpen: false, 
                isDisplayButtonContinueGame: true, 
                isDisplayButtonShop: false,
                isDisplayOutsideButtonMenu: true,
                isDisplayOutsideButtonShop: false,
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || defaultState;
};
