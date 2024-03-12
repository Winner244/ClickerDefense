import { Reducer } from 'redux';

import Panel from '../../../models/Panel';

// STATE
export interface PanelState {
    selectedItemId: string|null;
    panels: Panel[]
}

// ACTIONS
interface AddPanelAction { type: 'PANEL__ADD' }
interface RemovePanelAction { type: 'PANEL__REMOVE', index: number }
interface MovePanelAction { type: 'PANEL__MOVE', oldIndex: number, newIndex: number }

interface SelectItemAction { type: 'PANEL__SELECT_ITEM', itemId: string }

type KnownAction = AddPanelAction | RemovePanelAction | MovePanelAction | SelectItemAction;

// ACTION CREATORS
//for TypeScript
export interface PanelAction {
    add: () => AddPanelAction;
    remove: (index: number) => RemovePanelAction;
    move: (oldIndex: number, newIndex: number) => MovePanelAction;
    selectItem: (itemId: string) => SelectItemAction;
}
export const actionCreators = {
    add: () => <AddPanelAction>{ type: 'PANEL__ADD'},
    remove: (index: number) => <RemovePanelAction>{ type: 'PANEL__REMOVE', index: index },
    move: (oldIndex: number, newIndex: number) => <MovePanelAction>{ type: 'PANEL__MOVE', newIndex: newIndex, oldIndex: oldIndex },
    selectItem: (itemId: string) => <SelectItemAction>{ type: 'PANEL__SELECT_ITEM', itemId: itemId},
};

function getDefaultState(): PanelState{
    return {
        selectedItemId: null,
        panels: []
    };
}

// REDUCER 
export const reducer: Reducer<PanelState> = (state: PanelState | undefined, action: KnownAction) => {
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

        case 'PANEL__MOVE':
            let movedPanels = newPanels.splice(action.oldIndex, 1);
            newPanels.splice(action.newIndex, 0, movedPanels[0]);
            return Object.assign({}, getDefaultState(), { panels: newPanels });

        case 'PANEL__SELECT_ITEM':
            return Object.assign({}, state, { selectedItemId: action.itemId });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultState();
};
