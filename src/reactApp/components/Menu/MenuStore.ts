import { Reducer } from 'redux';

// STATE
export interface MenuState {
    isOpen: boolean;
    isDisplayButtonContinueGame: boolean;
    isDisplayOutsideButtonMenu: boolean;

    isDisplayButtonShop: boolean; //control by game logic
    isDisplayOutsideButtonShop: boolean; //control by view logic

    isDisplayNewWaveButton: boolean; //control by game logic
    isDisplayNewWaveOutsideButton: boolean; //control by view logic
}

// ACTIONS
interface StartAction { type: 'MENU__START' }
interface OpenAction { type: 'MENU__OPEN' }
interface CloseAction { type: 'MENU__CLOSE' }
interface StartGameAction { type: 'MENU__START_GAME' }
interface DisplayShopAction { type: 'MENU__DISPLAY_SHOP' }
interface HideShopAction { type: 'MENU__HIDE_SHOP' }
interface ViewNewWaveButtonAction { type: 'MENU__DISPLAY_NEW_WAVE_BUTTON', value: boolean }
interface ViewOutsideButtonsAction { type: 'MENU__DISPLAY_OUTSIDE_BUTTONS', value: boolean }

type KnownMenuAction = CloseAction | OpenAction | StartAction | StartGameAction | DisplayShopAction | HideShopAction | ViewNewWaveButtonAction | ViewOutsideButtonsAction;

// ACTION CREATORS
//for TypeScript
export interface MenuAction {
    close: () => CloseAction;
    open: () => OpenAction;
    openStartMenu: () => StartAction;
    startGame: () => StartGameAction;

    displayShopButton: () => DisplayShopAction;
    hideShopButton: () => HideShopAction;

    displayNewWaveButton: () => ViewNewWaveButtonAction;
    hideNewWaveButton: () => ViewNewWaveButtonAction;

    displayOutsideButtons: () => ViewOutsideButtonsAction;
    hideOutsideButtons: () => ViewOutsideButtonsAction;
}
export const actionCreators = {
    close: () => <CloseAction>{ type: 'MENU__CLOSE' },
    open: () => <OpenAction>{ type: 'MENU__OPEN'},
    openStartMenu: () => <StartAction>{ type: 'MENU__START'},
    startGame: () => <StartGameAction>{ type: 'MENU__START_GAME'},

    displayShopButton: () => <DisplayShopAction>{ type: 'MENU__DISPLAY_SHOP'},
    hideShopButton: () => <HideShopAction>{ type: 'MENU__HIDE_SHOP'},

    displayNewWaveButton: () => <ViewNewWaveButtonAction>{ type: 'MENU__DISPLAY_NEW_WAVE_BUTTON', value: true},
    hideNewWaveButton: () => <ViewNewWaveButtonAction>{ type: 'MENU__DISPLAY_NEW_WAVE_BUTTON', value: false},

    displayOutsideButtons: () => <ViewOutsideButtonsAction>{ type: 'MENU__DISPLAY_OUTSIDE_BUTTONS', value: true},
    hideOutsideButtons: () => <ViewOutsideButtonsAction>{ type: 'MENU__DISPLAY_OUTSIDE_BUTTONS', value: false},
};

const defaultMenuState: MenuState = {
    isOpen: true,
    isDisplayButtonContinueGame: false,
    isDisplayOutsideButtonMenu: false,

    isDisplayButtonShop: false,
    isDisplayOutsideButtonShop: false,

    isDisplayNewWaveButton: false,
    isDisplayNewWaveOutsideButton: false
};

// REDUCER 
export const reducer: Reducer<MenuState> = (state: MenuState | undefined, action: KnownMenuAction) => {
    switch (action.type) {
        case 'MENU__START':
            return defaultMenuState;
        case 'MENU__CLOSE':
            return Object.assign({}, state, { 
                isOpen: false, 
                isDisplayOutsideButtonMenu: true,
                isDisplayOutsideButtonShop: state?.isDisplayButtonShop, 
                isDisplayNewWaveOutsideButton: state?.isDisplayNewWaveButton
             });
        case 'MENU__OPEN':
            return Object.assign({}, state, { 
                isOpen: true, 
                isDisplayOutsideButtonMenu: false, 
                isDisplayOutsideButtonShop: false, 
                isDisplayNewWaveOutsideButton: false 
            });
        case 'MENU__START_GAME':
            return Object.assign({}, defaultMenuState, { 
                isOpen: false, 
                isDisplayButtonContinueGame: true,  
                isDisplayOutsideButtonMenu: true,
            });
        case 'MENU__DISPLAY_SHOP':
            return Object.assign({}, state, { isDisplayButtonShop: true, isDisplayOutsideButtonShop: true });
        case 'MENU__HIDE_SHOP':
            return Object.assign({}, state, { isDisplayButtonShop: false, isDisplayOutsideButtonShop: false });
        case 'MENU__DISPLAY_NEW_WAVE_BUTTON':
            return Object.assign({}, state, { 
                isDisplayNewWaveButton: action.value, 
                isDisplayNewWaveOutsideButton: action.value
            });
        case 'MENU__DISPLAY_OUTSIDE_BUTTONS':
            return Object.assign({}, state, { 
                isDisplayOutsideButtonMenu: action.value, 
                isDisplayOutsideButtonShop: action.value, 
                isDisplayNewWaveOutsideButton: action.value 
            });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || defaultMenuState;
};
