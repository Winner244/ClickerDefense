import { Reducer } from 'redux';
import { Building } from '../../../gameApp/gameObjects/Building';

// STATE
export interface BuildingButtonsState {
	isOpen: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    isDisplayRepairButton: boolean,
    isDisplayUpgradeButton: boolean,
    repairCost: number,
    building: Building|null
}

// ACTIONS
interface OpenAction { type: 'BUILDING_BUTTON__OPEN', 
    x: number, y: number, 
    width: number, height: number, 
    isDisplayRepairButton: boolean, 
    isDisplayUpgradeButton: boolean, 
    repairCost: number,
    building: Building
}
interface CloseAction { type: 'BUILDING_BUTTON__CLOSE' }
interface HideUpgradeButtonAction { type: 'BUILDING_BUTTON__HIDE_UPGRADE_BUTTON' }
type KnownAction = CloseAction | OpenAction | HideUpgradeButtonAction;

// ACTION CREATORS
//for TypeScript
export interface BuildingButtonsAction {
    open: (x: number, y: number, 
        width: number, height: number, 
        isDisplayRepairButton: boolean, 
        isDisplayUpgradeButton: boolean, 
        repairCost: number,
        building: Building) => OpenAction;

    close: () => CloseAction;
    hideUpgradeButton: () => HideUpgradeButtonAction;
}
export const actionCreators = {
    open: (x: number, y: number, 
        width: number, height: number, 
        isDisplayRepairButton: boolean, 
        isDisplayUpgradeButton: boolean, 
        repairCost: number,
        building: Building) => <OpenAction>{ type: 'BUILDING_BUTTON__OPEN', 
            x, y, 
            width, height, 
            isDisplayRepairButton, isDisplayUpgradeButton, repairCost, building},

    close: () => <CloseAction>{ type: 'BUILDING_BUTTON__CLOSE' },
    hideUpgradeButton: () => <HideUpgradeButtonAction>{ type: 'BUILDING_BUTTON__HIDE_UPGRADE_BUTTON' },
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
        repairCost: 0,
        building: null
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
                repairCost: action.repairCost,
                building: action.building
              });
        case 'BUILDING_BUTTON__CLOSE':
            return getDefaultState();
        case 'BUILDING_BUTTON__HIDE_UPGRADE_BUTTON':
            return Object.assign({}, state, { 
                isDisplayUpgradeButton: false
              });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultState();
};
