import { Reducer } from 'redux';

import {ShopCategoryEnum} from '../../../enum/ShopCategoryEnum';
import ShopItem from '../../../models/ShopItem';
import { Barricade } from '../../../gameApp/buildings/Barricade';
import { Tower } from '../../../gameApp/buildings/Tower';
import { Miner } from '../../../gameApp/units/Miner';
import { Collector } from '../../../gameApp/units/Collector';

// STATE
export interface ShopState {
	isOpen: boolean;
	selectedCategory: ShopCategoryEnum;
    selectedItemNames: string[];
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
interface SelectItemAction { type: 'SHOP__SELECT_ITEM', itemName: string }

type KnownAction = CloseAction | OpenAction | SelectCategoryAction | SelectItemAction;

// ACTION CREATORS
//for TypeScript
export interface ShopAction {
    open: () => OpenAction;
    close: () => CloseAction;
    selectCategory: (category: string) => SelectCategoryAction;
    selectItem: (itemName: string) => SelectItemAction;
}
export const actionCreators = {
    open: () => <OpenAction>{ type: 'SHOP__OPEN'},
    close: () => <CloseAction>{ type: 'SHOP__CLOSE' },
    selectCategory: (category: string) => <SelectCategoryAction>{ type: 'SHOP__SELECT_CATEGORY', category: category},
    selectItem: (itemName: string) => <SelectItemAction>{ type: 'SHOP__SELECT_ITEM', itemName: itemName},
};

function getDefaultClosedState(): ShopState{
    return {
        isOpen: false,
        selectedCategory: ShopCategoryEnum.ALL,
        selectedItemNames: [],
        items: {
            [ShopCategoryEnum.MAGIC]: [],
            [ShopCategoryEnum.BUILDINGS]: [],
            [ShopCategoryEnum.UNITS]: []
        }
    };
}

function getDefaultOpenState(): ShopState{
    return {
        isOpen: false,
        selectedCategory: ShopCategoryEnum.ALL,
        selectedItemNames: [],
        items: {
            [ShopCategoryEnum.MAGIC]: [],
            [ShopCategoryEnum.BUILDINGS]: [
                Barricade.shopItem,
                Tower.shopItem
            ],
            [ShopCategoryEnum.UNITS]: [
                Miner.shopItem,
                Collector.shopItem
            ]
        }
    };
}

// REDUCER 
export const reducer: Reducer<ShopState> = (state: ShopState | undefined, action: KnownAction) => {
    switch (action.type) {
        case 'SHOP__OPEN':
            return Object.assign({}, getDefaultOpenState(), { isOpen: true });
        case 'SHOP__CLOSE':
            return getDefaultClosedState();
        case 'SHOP__SELECT_CATEGORY':
            return Object.assign({}, state, { selectedCategory: action.category == state?.selectedCategory ? ShopCategoryEnum.ALL : action.category });
        case 'SHOP__SELECT_ITEM':
            let selectedItemNames = [...state?.selectedItemNames || []];
            let index = selectedItemNames.indexOf(action.itemName);
            if(index == -1){
                selectedItemNames.push(action.itemName);
            }
            else{
                selectedItemNames.splice(index, 1);
            }
            return Object.assign({}, state, { selectedItemNames: selectedItemNames });
        default:
            const exhaustiveCheck: never = action;
    }

    return state || getDefaultClosedState();
};
