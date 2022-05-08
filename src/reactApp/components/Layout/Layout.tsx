import * as React from 'react';

import Menu from "../Menu/Menu";
import Shop from "../Shop/Shop";
import BuildingButtons from "../BuildingButtons/BuildingButtons";
import GameDisplay from "../GameDisplay/GameDisplay";
import Upgrade from "../Upgrade/Upgrade";

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
            <Upgrade />
            {this.props.children}
        </div>;
    }
}

