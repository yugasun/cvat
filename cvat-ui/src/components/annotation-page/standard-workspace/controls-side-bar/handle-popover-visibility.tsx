// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import Popover, { PopoverProps } from 'antd/lib/popover';

interface OwnProps {
    overlayClassName?: string;
    onVisibleChange?: (visible: boolean) => void;
}

export default function withVisibilityHandling(WrappedComponent: typeof Popover, popoverType: string) {
    return function (props: OwnProps & PopoverProps): JSX.Element {
        const [visible, setVisible] = useState<boolean>(false);
        const { overlayClassName, onVisibleChange, ...rest } = props;
        const overlayClassNames = typeof overlayClassName === 'string' ? overlayClassName.split(/\s+/) : [];
        const popoverClassName = `cvat-${popoverType}-popover`;
        overlayClassNames.push(popoverClassName);

        const { overlayStyle } = props;
        return (
            <WrappedComponent
                {...rest}
                overlayStyle={{
                    ...(typeof overlayStyle === 'object' ? overlayStyle : {}),
                    animationDuration: '0s',
                    animationDelay: '0s',
                }}
                trigger={visible ? ['click'] : ['click', 'hover']}
                overlayClassName={overlayClassNames.join(' ').trim()}
                onVisibleChange={(_visible: boolean) => {
                    if (_visible) {
                        const [element] = window.document.getElementsByClassName(popoverClassName);
                        if (element) {
                            element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            (element as HTMLElement).style.pointerEvents = '';
                            (element as HTMLElement).style.opacity = '';
                        }
                    }
                    setVisible(_visible);
                    if (onVisibleChange) onVisibleChange(_visible);
                }}
            />
        );
    };
}
