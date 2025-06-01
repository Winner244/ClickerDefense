import { Reducer } from 'redux';

import Panel from '../../../models/Panel';
import {Magic} from '../../../gameApp/magic/Magic';

// STATE
export interface PanelsState {
    selectedItemId: string|null,
    panels: Panel[],
    isDisabled: boolean,
    isOpened: boolean,
    isOpenedSecond: boolean,
    isOpenedThird: boolean,
}

// ACTIONS
interface AddPanelAction { type: 'PANEL__ADD' }
interface RemovePanelAction { type: 'PANEL__REMOVE', index: number }
interface AddItemAction { type: 'PANEL__ADD_ITEM', panelIndex: number, placeIndex: number, item: Magic }
interface SelectItemAction { type: 'PANEL__SELECT_ITEM', itemId: string }
interface DisableAction { type: 'PANEL__DISABLE' }
interface UnDisableAction { type: 'PANEL__UNDISABLE' }
interface openAction { type: 'PANEL__OPEN' }
interface openSecondAction { type: 'PANEL__OPEN_SECOND' }
interface openThirdAction { type: 'PANEL__OPEN_THIRD' }

type KnownAction = AddPanelAction | RemovePanelAction | AddItemAction | SelectItemAction | DisableAction | UnDisableAction | openAction | openSecondAction | openThirdAction;

// ACTION CREATORS
//for TypeScript
export interface PanelAction {
    add: () => AddPanelAction;
    addItem: (panelIndex: number, placeIndex: number, item: Magic) => AddItemAction;
    remove: (index: number) => RemovePanelAction;
    selectItem: (itemId: string) => SelectItemAction;
    disable: () => DisableAction;
    undisable: () => UnDisableAction;
    open: () => openAction;
    openSecond: () => openSecondAction;
    openThird: () => openThirdAction;
}
export const actionCreators = {
    add: () => <AddPanelAction>{ type: 'PANEL__ADD'},
    addItem: (panelIndex: number, placeIndex: number, item: Magic) => <AddItemAction>{ type: 'PANEL__ADD_ITEM', panelIndex, placeIndex, item },
    remove: (index: number) => <RemovePanelAction>{ type: 'PANEL__REMOVE', index: index },
    selectItem: (itemId: string) => <SelectItemAction>{ type: 'PANEL__SELECT_ITEM', itemId: itemId},
    disable: () => <DisableAction>{ type: 'PANEL__DISABLE'},
    undisable: () => <UnDisableAction>{ type: 'PANEL__UNDISABLE'},
    open: () => <openAction>{ type: 'PANEL__OPEN'},
    openSecond: () => <openSecondAction>{ type: 'PANEL__OPEN_SECOND'},
    openThird: () => <openThirdAction>{ type: 'PANEL__OPEN_THIRD'},
};

function getDefaultState(): PanelsState{
    return {
        selectedItemId: null,
        panels: [],
        isDisabled: false,
        isOpened: false,
        isOpenedSecond: false,
        isOpenedThird: false
    };
}

// REDUCER 
export const reducer: Reducer<PanelsState> = (state: PanelsState | undefined, action: KnownAction) => {
    let newPanels: Panel[] = [];
    
    if(state){
        newPanels = newPanels.concat(state.panels);
    }

    switch (action.type) {
        case 'PANEL__ADD':
            newPanels.push(new Panel(newPanels.length));
            return Object.assign({}, state, { panels: newPanels });

        case 'PANEL__REMOVE':
            newPanels.splice(action.index, 1);
            return Object.assign({}, state, { panels: newPanels });

        case 'PANEL__ADD_ITEM':
            newPanels[action.panelIndex].items.splice(action.placeIndex, 1, action.item);
            return Object.assign({}, state, { panels: newPanels });

        case 'PANEL__SELECT_ITEM':
            return Object.assign({}, state, { selectedItemId: action.itemId });

        case 'PANEL__DISABLE':
            return Object.assign({}, state, { isDisabled: true });

        case 'PANEL__UNDISABLE':
            return Object.assign({}, state, { isDisabled: false });

        case 'PANEL__OPEN':
            return Object.assign({}, state, { isOpened: true });

        case 'PANEL__OPEN_SECOND':
            return Object.assign({}, state, { isOpenedSecond: true });

        case 'PANEL__OPEN_THIRD':
            return Object.assign({}, state, { isOpenedThird: true });

        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultState();
};
