import { Reducer } from 'redux';

import {ShopCategoryEnum} from '../../../enum/ShopCategoryEnum';
import { Tower } from '../../../gameApp/buildings/Tower';
import ShopItem from '../../../models/ShopItem';

// STATE
export interface ShopState {
	isOpen: boolean;
	selectedCategory: ShopCategoryEnum;
    selectedItemId: number;
    items: {
        [ShopCategoryEnum.MAGIC]: ShopItem[],
        [ShopCategoryEnum.BUILDINGS]: ShopItem[],
        [ShopCategoryEnum.UNITS]: ShopItem[]
    }
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
    selectedCategory: ShopCategoryEnum.ALL,
    selectedItemId: 0,
    items: {
        [ShopCategoryEnum.MAGIC]: [],
        [ShopCategoryEnum.BUILDINGS]: [
            new Tower(0)
        ],
        [ShopCategoryEnum.UNITS]: []
    }
};

// REDUCER 
export const reducer: Reducer<ShopState> = (state: ShopState | undefined, action: KnownAction) => {
    switch (action.type) {
        case 'SHOP__OPEN':
            return Object.assign({}, defaultState, { isOpen: true });
        case 'SHOP__CLOSE':
            return defaultState;
        case 'SHOP__SELECT_CATEGORY':
            return Object.assign({}, state, { selectedCategory: action.category == state?.selectedCategory ? ShopCategoryEnum.ALL : action.category });
        case 'SHOP__SELECT_ITEM':
            return Object.assign({}, state, { selectedItemId: action.itemId });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || defaultState;
};
