import { Reducer } from 'redux';
import { Label } from '../../../models/Label';

// STATE
export interface CoinLabelsState {
	items: Label[]
}

// ACTIONS
interface EmptyAction { type: 'COIN_LABELS' }
interface AddAction { type: 'COIN_LABELS__ADD', item: Label }
interface UpdateAction { type: 'COIN_LABELS__UPDATE', id: string, x: number, y: number }
interface DeleteAction { type: 'COIN_LABELS__DELETE', id: string }

type KnownAction = EmptyAction | AddAction | UpdateAction | DeleteAction

// ACTION CREATORS
//for TypeScript
export interface CoinLabelsAction {
    add: (item: Label) => AddAction;
    update: (id: string, x: number, y: number) => UpdateAction;
    delete: (id: string) => DeleteAction;
}
export const actionCreators = {
    add: (item: Label) => <AddAction>{ type: 'COIN_LABELS__ADD', item},
    update: (id: string, x: number, y: number) => <UpdateAction>{ type: 'COIN_LABELS__UPDATE', id, x, y },
    delete: (id: string) => <DeleteAction>{ type: 'COIN_LABELS__DELETE', id },
};

function getDefaultState(): CoinLabelsState{
    return {
        items: []
    };
}

// REDUCER 
export const reducer: Reducer<CoinLabelsState> = (state: CoinLabelsState | undefined, action: KnownAction) => {
    const stateItems = state?.items || [];
    const emptyArray: Label[] = [];
    switch (action.type) {
        case 'COIN_LABELS':
            return getDefaultState();
        case 'COIN_LABELS__ADD':
            return Object.assign({}, getDefaultState(), { items: emptyArray.concat(stateItems, action.item) });
        case 'COIN_LABELS__UPDATE':
            const updateItems = emptyArray.concat(stateItems);
            const updatedItem = updateItems.find(x => x.id == action.id);
            if(updatedItem){
                updatedItem.x = action.x;
                updatedItem.y = action.y;
            }
            return Object.assign({}, getDefaultState(), { items: updateItems });
        case 'COIN_LABELS__DELETE':
            const newItems = stateItems.filter(x => x.id != action.id);
            return Object.assign({}, getDefaultState(), { items: newItems });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultState();
};
