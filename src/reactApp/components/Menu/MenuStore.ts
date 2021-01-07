import { Reducer } from 'redux';

// STATE
export interface MenuState {
	isOpen: boolean;
}

// ACTIONS
interface CloseAction { type: 'MENU__CLOSE' }
interface OpenAction { type: 'MENU__OPEN', text: string }

type KnownAction = CloseAction | OpenAction;

// ACTION CREATORS
//for TypeScript
export interface MenuAction {
    close: () => CloseAction;
    open: () => OpenAction;
}
export const actionCreators = {
    close: () => <CloseAction>{ type: 'MENU__CLOSE' },
    open: () => <OpenAction>{ type: 'MENU__OPEN'}
};

// REDUCER 
export const reducer: Reducer<MenuState> = (state: MenuState, action: KnownAction) => {
    switch (action.type) {
        case 'MENU__CLOSE':
            return { isOpen: true };
        case 'MENU__OPEN':
            return { isOpen: false };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || {
        isOpen: true,
    };
};
