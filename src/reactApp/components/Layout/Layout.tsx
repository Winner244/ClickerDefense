import * as React from 'react';

import Menu from "../Menu/Menu";
import GameDisplay from "../GameDisplay/GameDisplay";

export interface Props {
    children?: React.ReactNode;
}

export default class Layout extends React.Component<Props, {}> {
    public render() {
        return <div>
            <GameDisplay />
            <Menu />
            {this.props.children}
        </div>;
    }
}

