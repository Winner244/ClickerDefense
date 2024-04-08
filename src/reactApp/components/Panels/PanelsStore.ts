import { Reducer } from 'redux';

import Panel from '../../../models/Panel';
import {Magic} from '../../../gameApp/magic/Magic';

// STATE
export interface PanelsState {
    selectedItemId: string|null;
    panels: Panel[]
}

// ACTIONS
interface AddPanelAction { type: 'PANEL__ADD' }
interface RemovePanelAction { type: 'PANEL__REMOVE', index: number }

interface AddItemAction { type: 'PANEL__ADD_ITEM', panelIndex: number, placeIndex: number, item: Magic }

interface SelectItemAction { type: 'PANEL__SELECT_ITEM', itemId: string }

type KnownAction = AddPanelAction | RemovePanelAction | AddItemAction | SelectItemAction;

// ACTION CREATORS
//for TypeScript
export interface PanelAction {
    add: () => AddPanelAction;
    addItem: (panelIndex: number, placeIndex: number, item: Magic) => AddItemAction;
    remove: (index: number) => RemovePanelAction;
    selectItem: (itemId: string) => SelectItemAction;
}
export const actionCreators = {
    add: () => <AddPanelAction>{ type: 'PANEL__ADD'},
    addItem: (panelIndex: number, placeIndex: number, item: Magic) => <AddItemAction>{ type: 'PANEL__ADD_ITEM', panelIndex, placeIndex, item },
    remove: (index: number) => <RemovePanelAction>{ type: 'PANEL__REMOVE', index: index },
    selectItem: (itemId: string) => <SelectItemAction>{ type: 'PANEL__SELECT_ITEM', itemId: itemId},
};

function getDefaultState(): PanelsState{
    return {
        selectedItemId: null,
        panels: []
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
            return Object.assign({}, getDefaultState(), { panels: newPanels });

        case 'PANEL__REMOVE':
            newPanels.splice(action.index, 1);
            return Object.assign({}, getDefaultState(), { panels: newPanels });

        case 'PANEL__ADD_ITEM':
            newPanels[action.panelIndex].items.splice(action.placeIndex, 1, action.item);
            return Object.assign({}, getDefaultState(), { panels: newPanels });

        case 'PANEL__SELECT_ITEM':
            return Object.assign({}, state, { selectedItemId: action.itemId });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultState();
};
