import { Reducer } from 'redux';

// STATE
export interface BuildingButtonsState {
	isOpen: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    isDisplayRepairButton: boolean,
    isDisplayUpgradeButton: boolean,
    repairCost: number
}

// ACTIONS
interface OpenAction { type: 'BUILDING_BUTTON__OPEN', 
    x: number, y: number, 
    width: number, height: number, 
    isDisplayRepairButton: boolean, 
    isDisplayUpgradeButton: boolean, 
    repairCost: number }
interface CloseAction { type: 'BUILDING_BUTTON__CLOSE' }
type KnownAction = CloseAction | OpenAction;

// ACTION CREATORS
//for TypeScript
export interface BuildingButtonsAction {
    open: (x: number, y: number, 
        width: number, height: number, 
        isDisplayRepairButton: boolean, 
        isDisplayUpgradeButton: boolean, 
        repairCost: number) => OpenAction;

    close: () => CloseAction;
}
export const actionCreators = {
    open: (x: number, y: number, 
        width: number, height: number, 
        isDisplayRepairButton: boolean, 
        isDisplayUpgradeButton: boolean, 
        repairCost: number) => <OpenAction>{ type: 'BUILDING_BUTTON__OPEN', 
            x, y, 
            width, height, 
            isDisplayRepairButton, isDisplayUpgradeButton, repairCost},

    close: () => <CloseAction>{ type: 'BUILDING_BUTTON__CLOSE' },
};

function getDefaultState(): BuildingButtonsState{
    return {
        isOpen: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        isDisplayRepairButton: false,
        isDisplayUpgradeButton: false,
        repairCost: 0
    };
}

// REDUCER 
export const reducer: Reducer<BuildingButtonsState> = (state: BuildingButtonsState | undefined, action: KnownAction) => {
    switch (action.type) {
        case 'BUILDING_BUTTON__OPEN':
            return Object.assign({}, getDefaultState(), { isOpen: true, 
                x: action.x, y: action.y, 
                width: action.width, height: action.height,
                isDisplayRepairButton: action.isDisplayRepairButton,
                isDisplayUpgradeButton: action.isDisplayUpgradeButton,
                repairCost: action.repairCost
              });
        case 'BUILDING_BUTTON__CLOSE':
            return getDefaultState();
        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultState();
};
