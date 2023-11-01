import { Reducer } from 'redux';
import { Unit } from '../../../gameApp/units/Unit';

// STATE
export interface UnitButtonsState {
	isOpen: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    isDisplayHealingingButton: boolean,
    isDisplayUpgradeButton: boolean,
    healingingCost: number,
    unit: Unit|null
}

// ACTIONS
interface OpenAction { type: 'UNIT_BUTTON__OPEN', 
    x: number, y: number, 
    width: number, height: number, 
    isDisplayHealingingButton: boolean, 
    isDisplayUpgradeButton: boolean, 
    healingingCost: number,
    unit: Unit
}
interface CloseAction { type: 'UNIT_BUTTON__CLOSE' }
interface HideUpgradeButtonAction { type: 'UNIT_BUTTON__HIDE_UPGRADE_BUTTON' }
interface HideHealingButtonAction { type: 'UNIT_BUTTON__HIDE_HEALING_BUTTON' }
type KnownAction = CloseAction | OpenAction | HideUpgradeButtonAction | HideHealingButtonAction;

// ACTION CREATORS
//for TypeScript
export interface UnitButtonsAction {
    open: (x: number, y: number, 
        width: number, height: number, 
        isDisplayHealingingButton: boolean, 
        isDisplayUpgradeButton: boolean, 
        healingingCost: number,
        unit: Unit) => OpenAction;

    close: () => CloseAction;
    hideUpgradeButton: () => HideUpgradeButtonAction;
    hideHealingButton: () => HideHealingButtonAction;
}
export const actionCreators = {
    open: (x: number, y: number, 
        width: number, height: number, 
        isDisplayHealingingButton: boolean, 
        isDisplayUpgradeButton: boolean, 
        healingingCost: number,
        unit: Unit) => <OpenAction>{ type: 'UNIT_BUTTON__OPEN', 
            x, y, 
            width, height, 
            isDisplayHealingingButton, isDisplayUpgradeButton, healingingCost, unit},

    close: () => <CloseAction>{ type: 'UNIT_BUTTON__CLOSE' },
    hideUpgradeButton: () => <HideUpgradeButtonAction>{ type: 'UNIT_BUTTON__HIDE_UPGRADE_BUTTON' },
    hideHealingButton: () => <HideHealingButtonAction>{ type: 'UNIT_BUTTON__HIDE_HEALING_BUTTON' },
};

function getDefaultState(): UnitButtonsState{
    return {
        isOpen: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        isDisplayHealingingButton: false,
        isDisplayUpgradeButton: false,
        healingingCost: 0,
        unit: null
    };
}

// REDUCER 
export const reducer: Reducer<UnitButtonsState> = (state: UnitButtonsState | undefined, action: KnownAction) => {
    switch (action.type) {
        case 'UNIT_BUTTON__OPEN':
            return Object.assign({}, getDefaultState(), { isOpen: true, 
                x: action.x, y: action.y, 
                width: action.width, height: action.height,
                isDisplayHealingingButton: action.isDisplayHealingingButton,
                isDisplayUpgradeButton: action.isDisplayUpgradeButton,
                healingingCost: action.healingingCost,
                unit: action.unit
              });
        case 'UNIT_BUTTON__CLOSE':
            return getDefaultState();
        case 'UNIT_BUTTON__HIDE_UPGRADE_BUTTON':
            return Object.assign({}, state, { 
                isDisplayUpgradeButton: false
              });
        case 'UNIT_BUTTON__HIDE_HEALING_BUTTON':
            return Object.assign({}, state, { 
                isDisplayHealingingButton: false
            });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultState();
};
