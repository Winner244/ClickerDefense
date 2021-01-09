import { Reducer } from 'redux';

// STATE
export interface ShopState {
	isOpen: boolean;
	selectedCategoryId: number;
	selectedItemId: number;
}

// ACTIONS
interface OpenAction { type: 'SHOP__OPEN' }
interface CloseAction { type: 'SHOP__CLOSE' }
interface SelectCategoryAction { type: 'SHOP__SELECT_CATEGORY', categoryId: number }
interface SelectItemAction { type: 'SHOP__SELECT_ITEM', itemId: number }

type KnownAction = CloseAction | OpenAction | SelectCategoryAction | SelectItemAction;

// ACTION CREATORS
//for TypeScript
export interface ShopAction {
    open: () => OpenAction;
    close: () => CloseAction;
    selectCategory: (categoryId: number) => SelectCategoryAction;
    selectItem: (itemId: number) => SelectItemAction;
}
export const actionCreators = {
    open: () => <OpenAction>{ type: 'SHOP__OPEN'},
    close: () => <CloseAction>{ type: 'SHOP__CLOSE' },
    selectCategory: (categoryId: number) => <SelectCategoryAction>{ type: 'SHOP__SELECT_CATEGORY', categoryId: categoryId},
    selectItem: (itemId: number) => <SelectItemAction>{ type: 'SHOP__SELECT_ITEM', itemId: itemId},
};

const defaultState: ShopState = {
    isOpen: false,
    selectedCategoryId: 0,
    selectedItemId: 0,
};

// REDUCER 
export const reducer: Reducer<ShopState> = (state: ShopState | undefined, action: KnownAction) => {
    switch (action.type) {
        case 'SHOP__OPEN':
            console.log('SHOP__OPEN');
            return Object.assign({}, defaultState, { isOpen: true });
        case 'SHOP__CLOSE':
            return defaultState;
        case 'SHOP__SELECT_CATEGORY':
            return Object.assign({}, state, { selectedCategoryId: action.categoryId == state?.selectedCategoryId ? 0 : action.categoryId });
        case 'SHOP__SELECT_ITEM':
            return Object.assign({}, state, { selectedItemId: action.itemId });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || defaultState;
};
