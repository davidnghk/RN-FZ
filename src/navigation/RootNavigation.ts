import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name: string, screenName: {}, params: any) {

    // console.log(navigationRef);
    navigationRef.current?.navigate(name, screenName, params);
};

