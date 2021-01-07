import * as AlertStore from '../components/Alert/AlertStore';
import * as WaitStore from '../components/Wait/WaitStore';
import * as RegistrationPageStore from '../pages/Registration/RegistrationPageStore';
import * as AuthorizationPageStore from '../pages/Authorization/AuthorizationPageStore';
import * as MainPageStore from '../pages/Main/MainPageStore';

// The top-level state object
export interface ApplicationState {
    alert: AlertStore.AlertState;
    wait: WaitStore.WaitState;
    registrationPage: RegistrationPageStore.RegistrationPageState;
    authorizationPage: AuthorizationPageStore.AuthorizationPageState;
    mainPage: MainPageStore.MainPageState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    alert: AlertStore.reducer,
    wait: WaitStore.reducer,
    registrationPage: RegistrationPageStore.reducer,
    authorizationPage: AuthorizationPageStore.reducer,
    mainPage: MainPageStore.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
