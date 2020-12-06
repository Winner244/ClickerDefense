import { Store } from "redux";
import { History } from 'history';
import { ApplicationState } from "./store";

export class App {

    public static Store: Store<ApplicationState>;

    public static History: History;
}