import * as React from 'react';

import Menu from "../Menu/Menu";

export interface Props {
    children?: React.ReactNode;
}

export default class Layout extends React.Component<Props, {}> {
    public render() {
        return <div>
            <Menu />
            {this.props.children}
        </div>;
    }
}

