import * as React from 'react';

import Menu from "../Menu/Menu";
import Shop from "../Shop/Shop";
import Panels from "../Panels/Panels";
import BuildingButtons from "../BuildingButtons/BuildingButtons";
import UnitButtons from "../UnitButtons/UnitButtons";
import GameDisplay from "../GameDisplay/GameDisplay";
import Upgrade from "../Upgrade/Upgrade";
import CoinLabels from "../CoinLabels/CoinLabels";

export interface Props {
    children?: React.ReactNode;
}

export default class Layout extends React.Component<Props, {}> {
    public render() {
        return <div>
            <GameDisplay />
            {this.props.children}
            <Panels />
            <BuildingButtons />
            <UnitButtons />
            <Shop />
            <Upgrade />
            <Menu />
            <CoinLabels />
        </div>;
    }
}

