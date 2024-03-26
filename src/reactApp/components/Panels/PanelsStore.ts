import { Reducer } from 'redux';

import Panel from '../../../models/Panel';

// STATE
export interface PanelsState {
    selectedItemId: string|null;
    panels: Panel[]
}

// ACTIONS
interface AddPanelAction { type: 'PANEL__ADD' }
interface RemovePanelAction { type: 'PANEL__REMOVE', index: number }

interface SelectItemAction { type: 'PANEL__SELECT_ITEM', itemId: string }

type KnownAction = AddPanelAction | RemovePanelAction | SelectItemAction;

// ACTION CREATORS
//for TypeScript
export interface PanelAction {
    add: () => AddPanelAction;
    remove: (index: number) => RemovePanelAction;
    selectItem: (itemId: string) => SelectItemAction;
}
export const actionCreators = {
    add: () => <AddPanelAction>{ type: 'PANEL__ADD'},
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

        case 'PANEL__SELECT_ITEM':
            return Object.assign({}, state, { selectedItemId: action.itemId });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultState();
};
