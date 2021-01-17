import { Reducer } from 'redux';

import ShoCategoryEnum from '../../../enum/ShoCategoryEnum';

// STATE
export interface ShopState {
	isOpen: boolean;
	selectedCategory: string;
	selectedItemId: number;
}

// ACTIONS
interface OpenAction { type: 'SHOP__OPEN' }
interface CloseAction { type: 'SHOP__CLOSE' }
interface SelectCategoryAction { type: 'SHOP__SELECT_CATEGORY', category: string }
interface SelectItemAction { type: 'SHOP__SELECT_ITEM', itemId: number }

type KnownAction = CloseAction | OpenAction | SelectCategoryAction | SelectItemAction;

// ACTION CREATORS
//for TypeScript
export interface ShopAction {
    open: () => OpenAction;
    close: () => CloseAction;
    selectCategory: (category: string) => SelectCategoryAction;
    selectItem: (itemId: number) => SelectItemAction;
}
export const actionCreators = {
    open: () => <OpenAction>{ type: 'SHOP__OPEN'},
    close: () => <CloseAction>{ type: 'SHOP__CLOSE' },
    selectCategory: (category: string) => <SelectCategoryAction>{ type: 'SHOP__SELECT_CATEGORY', category: category},
    selectItem: (itemId: number) => <SelectItemAction>{ type: 'SHOP__SELECT_ITEM', itemId: itemId},
};

const defaultState: ShopState = {
    isOpen: false,
    selectedCategory: ShoCategoryEnum.ALL,
    selectedItemId: 0,
};

// REDUCER 
export const reducer: Reducer<ShopState> = (state: ShopState | undefined, action: KnownAction) => {
    switch (action.type) {
        case 'SHOP__OPEN':
            return Object.assign({}, defaultState, { isOpen: true });
        case 'SHOP__CLOSE':
            return defaultState;
        case 'SHOP__SELECT_CATEGORY':
            return Object.assign({}, state, { selectedCategory: action.category == state?.selectedCategory ? ShoCategoryEnum.ALL : action.category });
        case 'SHOP__SELECT_ITEM':
            return Object.assign({}, state, { selectedItemId: action.itemId });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || defaultState;
};
