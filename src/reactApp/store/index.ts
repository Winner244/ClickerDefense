import * as MenuStore from '../components/Menu/MenuStore';
import * as ShopStore from '../components/Shop/ShopStore';
import * as BuildingButtonsStore from '../components/BuildingButtons/BuildingButtonsStore';
import * as UpgradeStore from '../components/Upgrade/UpgradeStore';

// The top-level state object
export interface ApplicationState {
    menu: MenuStore.MenuState | undefined;
    shop: ShopStore.ShopState | undefined;
    buildingButtons: BuildingButtonsStore.BuildingButtonsState | undefined;
    upgrade: UpgradeStore.UpgradeState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    menu: MenuStore.reducer,
    shop: ShopStore.reducer,
    buildingButtons: BuildingButtonsStore.reducer,
    upgrade: UpgradeStore.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
