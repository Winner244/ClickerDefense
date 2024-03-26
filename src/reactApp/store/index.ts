import * as MenuStore from '../components/Menu/MenuStore';
import * as ShopStore from '../components/Shop/ShopStore';
import * as PanelsStore from '../components/Panels/PanelsStore';
import * as BuildingButtonsStore from '../components/BuildingButtons/BuildingButtonsStore';
import * as UnitButtonsStore from '../components/UnitButtons/UnitButtonsStore';
import * as UpgradeStore from '../components/Upgrade/UpgradeStore';
import * as CoinLabelsStore from '../components/CoinLabels/CoinLabelsStore';

// The top-level state object
export interface ApplicationState {
    menu: MenuStore.MenuState | undefined;
    shop: ShopStore.ShopState | undefined;
    panels: PanelsStore.PanelsState | undefined;
    buildingButtons: BuildingButtonsStore.BuildingButtonsState | undefined;
    unitButtons: UnitButtonsStore.UnitButtonsState | undefined;
    upgrade: UpgradeStore.UpgradeState | undefined;
    coinLabels: CoinLabelsStore.CoinLabelsState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    menu: MenuStore.reducer,
    shop: ShopStore.reducer,
    panels: PanelsStore.reducer,
    buildingButtons: BuildingButtonsStore.reducer,
    unitButtons: UnitButtonsStore.reducer,
    upgrade: UpgradeStore.reducer,
    coinLabels: CoinLabelsStore.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
