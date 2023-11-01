import {Reducer} from 'redux';
import {UpgradebleObject} from '../../../models/UpgradebleObject';

// STATE
export interface UpgradeState {
	isOpen: boolean;
	selectedObject: UpgradebleObject | null;
}

// ACTIONS
interface OpenAction { type: 'UPGRADE__OPEN', selectedObject: UpgradebleObject }
interface CloseAction { type: 'UPGRADE__CLOSE' }

type KnownAction = CloseAction | OpenAction

// ACTION CREATORS
//for TypeScript
export interface UpgradeAction {
    open: (selectedObject: UpgradebleObject) => OpenAction;
    close: () => CloseAction;
}
export const actionCreators = {
    open: (selectedObject: UpgradebleObject) => <OpenAction>{ type: 'UPGRADE__OPEN', selectedObject: selectedObject},
    close: () => <CloseAction>{ type: 'UPGRADE__CLOSE' },
};

function getDefaultState(): UpgradeState{
    return {
        isOpen: false,
        selectedObject: null,
    };
}

// REDUCER 
export const reducer: Reducer<UpgradeState> = (state: UpgradeState | undefined, action: KnownAction) => {
    switch (action.type) {
        case 'UPGRADE__OPEN':
            return Object.assign({}, getDefaultState(), { isOpen: true, selectedObject: action.selectedObject });
        case 'UPGRADE__CLOSE':
            return getDefaultState();
        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultState();
};
