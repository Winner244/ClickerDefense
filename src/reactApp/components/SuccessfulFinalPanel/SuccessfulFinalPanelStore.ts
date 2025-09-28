import { Reducer } from 'redux';

// STATE
export interface SuccessfulFinalPanelState {
	isOpen: boolean;
}

// ACTIONS
interface OpenAction { type: 'SUCCESSFUL_FINAL_PANEL__OPEN'}
interface CloseAction { type: 'SUCCESSFUL_FINAL_PANEL__CLOSE' }
type KnownAction = CloseAction | OpenAction;

// ACTION CREATORS
//for TypeScript
export interface SuccessfulFinalPanelAction {
    open: () => OpenAction;
    close: () => CloseAction;
}
export const actionCreators = {
    open: () => <OpenAction>{ type: 'SUCCESSFUL_FINAL_PANEL__OPEN' },
    close: () => <CloseAction>{ type: 'SUCCESSFUL_FINAL_PANEL__CLOSE' },
};

function getDefaultState(): SuccessfulFinalPanelState{
    return { isOpen: false };
}

// REDUCER 
export const reducer: Reducer<SuccessfulFinalPanelState> = (state: SuccessfulFinalPanelState | undefined, action: KnownAction) => {
    switch (action.type) {
        case 'SUCCESSFUL_FINAL_PANEL__OPEN':
            return Object.assign({}, getDefaultState(), { isOpen: true });
        case 'SUCCESSFUL_FINAL_PANEL__CLOSE':
            return getDefaultState();
        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultState();
};
