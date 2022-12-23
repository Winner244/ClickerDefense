import { Reducer } from 'redux';
import { Building } from '../../../gameApp/buildings/Building';

// STATE
export interface UpgradeState {
	isOpen: boolean;
	selectedBuilding: Building | null;
}

// ACTIONS
interface OpenAction { type: 'UPGRADE__OPEN', building: Building }
interface CloseAction { type: 'UPGRADE__CLOSE' }

type KnownAction = CloseAction | OpenAction

// ACTION CREATORS
//for TypeScript
export interface UpgradeAction {
    open: (building: Building) => OpenAction;
    close: () => CloseAction;
}
export const actionCreators = {
    open: (building: Building) => <OpenAction>{ type: 'UPGRADE__OPEN', building: building},
    close: () => <CloseAction>{ type: 'UPGRADE__CLOSE' },
};

function getDefaultState(): UpgradeState{
    return {
        isOpen: false,
        selectedBuilding: null,
    };
}

// REDUCER 
export const reducer: Reducer<UpgradeState> = (state: UpgradeState | undefined, action: KnownAction) => {
    switch (action.type) {
        case 'UPGRADE__OPEN':
            return Object.assign({}, getDefaultState(), { isOpen: true, selectedBuilding: action.building });
        case 'UPGRADE__CLOSE':
            return getDefaultState();
        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultState();
};
