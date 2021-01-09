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
interface OpenAction { type: 'MENU__OPEN' }
interface CloseAction { type: 'MENU__CLOSE' }
interface StartGameAction { type: 'MENU__START_GAME' }
interface DisplayShopAction { type: 'MENU__DISPLAY_SHOP' }
interface HideShopAction { type: 'MENU__HIDE_SHOP' }

type KnownMenuAction = CloseAction | OpenAction | StartAction | StartGameAction | DisplayShopAction | HideShopAction;

// ACTION CREATORS
//for TypeScript
export interface MenuAction {
    close: () => CloseAction;
    open: () => OpenAction;
    openStartMenu: () => StartAction;
    startGame: () => StartGameAction;
    displayShop: () => DisplayShopAction;
    hideShop: () => HideShopAction;
}
export const actionCreators = {
    close: () => <CloseAction>{ type: 'MENU__CLOSE' },
    open: () => <OpenAction>{ type: 'MENU__OPEN'},
    openStartMenu: () => <StartAction>{ type: 'MENU__START'},
    startGame: () => <StartGameAction>{ type: 'MENU__START_GAME'},
    displayShop: () => <DisplayShopAction>{ type: 'MENU__DISPLAY_SHOP'},
    hideShop: () => <HideShopAction>{ type: 'MENU__HIDE_SHOP'},
};

const defaultMenuState: MenuState = {
    isOpen: true,
    isDisplayButtonContinueGame: false,
    isDisplayButtonShop: false,
    isDisplayOutsideButtonMenu: false,
    isDisplayOutsideButtonShop: false,
};

// REDUCER 
export const reducer: Reducer<MenuState> = (state: MenuState | undefined, action: KnownMenuAction) => {
    switch (action.type) {
        case 'MENU__START':
            return defaultMenuState;
        case 'MENU__CLOSE':
            return Object.assign({}, state, { isOpen: false });
        case 'MENU__OPEN':
            return Object.assign({}, state, { isOpen: true });
        case 'MENU__START_GAME':
            return { 
                isOpen: false, 
                isDisplayButtonContinueGame: true, 
                isDisplayButtonShop: false,
                isDisplayOutsideButtonMenu: true,
                isDisplayOutsideButtonShop: false,
            };
        case 'MENU__DISPLAY_SHOP':
            return Object.assign({}, state, { isDisplayButtonShop: true, isDisplayOutsideButtonShop: true });
        case 'MENU__HIDE_SHOP':
            return Object.assign({}, state, { isDisplayButtonShop: false, isDisplayOutsideButtonShop: false });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || defaultMenuState;
};
