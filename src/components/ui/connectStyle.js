import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { ui } from '../../constants/Theme';
import lodash from 'lodash';
/*
* 1.只传componentStyleName，样式要在Theme中配置，
* 2.两个参数都传，使用外部传入的样式
* */
export default (componentStyleName, componentStyle) => {

    return (WrappedComponent) => {

        class StyledComponent extends React.PureComponent {
            constructor(props) {
                super(props);
            }

            render() {
                let { styleName = 'default', style, ...props } = this.props;
                let themeStyle = componentStyle ? componentStyle : ui[componentStyleName][styleName];
                let isContainObjectStyle = false;
                for (let entry of Object.values(themeStyle)) {
                    if (lodash.isObject(entry)) {
                        isContainObjectStyle = true;
                        break;
                    }
                }

                if (isContainObjectStyle) {
                    return (<WrappedComponent
                        style={style && style}
                        themeStyle={themeStyle}
                        {...props}
                    />);
                } else {
                    return (
                        <WrappedComponent
                            style={[themeStyle, style && style]}
                            {...props}
                        />);
                }

            }
        }

        return hoistStatics(StyledComponent, WrappedComponent);
    };
}
