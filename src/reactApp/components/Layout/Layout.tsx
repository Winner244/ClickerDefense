import * as React from 'react';

import Menu from "../Menu/Menu";
import Shop from "../Shop/Shop";
import BuildingButtons from "../BuildingButtons/BuildingButtons";
import GameDisplay from "../GameDisplay/GameDisplay";

export interface Props {
    children?: React.ReactNode;
}

export default class Layout extends React.Component<Props, {}> {
    public render() {
        return <div>
            <GameDisplay />
            <Menu />
            <Shop />
            <BuildingButtons />
            {this.props.children}
        </div>;
    }
}

