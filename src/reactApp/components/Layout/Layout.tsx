import * as React from 'react';

import Menu from "../Menu/Menu";
import Shop from "../Shop/Shop";
import Panel from "../Panel/Panel";
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
            <Panel />
            <BuildingButtons />
            <UnitButtons />
            <Shop />
            <Upgrade />
            <Menu />
            <CoinLabels />
        </div>;
    }
}

