import React, {createContext} from 'react';

export const AppContext = createContext(null);

export const withAppContext = (Component, mapStateToProps = null) => {
    return props => {
        return (
            <AppContext.Consumer>
                {state => {
                    const mappedProps = mapStateToProps ? mapStateToProps(state) : state;
                    const mergedProps = {...props, ...mappedProps};

                    return <Component {...mergedProps} />;
                }}
            </AppContext.Consumer>
        );
    };
};
