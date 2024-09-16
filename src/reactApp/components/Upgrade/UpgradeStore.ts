import {Reducer} from 'redux';
import {IUpgradableObject} from '../../../models/IUpgradableObject';

// STATE
export interface UpgradeState {
	isOpen: boolean;
	selectedObject: IUpgradableObject | null;
}

// ACTIONS
interface OpenAction { type: 'UPGRADE__OPEN', selectedObject: IUpgradableObject }
interface CloseAction { type: 'UPGRADE__CLOSE' }

type KnownAction = CloseAction | OpenAction

// ACTION CREATORS
//for TypeScript
export interface UpgradeAction {
    open: (selectedObject: IUpgradableObject) => OpenAction;
    close: () => CloseAction;
}
export const actionCreators = {
    open: (selectedObject: IUpgradableObject) => <OpenAction>{ type: 'UPGRADE__OPEN', selectedObject: selectedObject},
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
