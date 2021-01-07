import * as React from 'react';

import Menu from "../Menu/Menu";
import Game from "../Game/Game";

export interface Props {
    children?: React.ReactNode;
}

export default class Layout extends React.Component<Props, {}> {
    public render() {
        return <div>
            <Game />
            <Menu />
            {this.props.children}
        </div>;
    }
}

