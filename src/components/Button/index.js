import * as React from 'react';
import { Button } from '@material-ui/core';

export default function CustomButton({
    children,
    variant = 'contained',
    color = 'primary',
    ...rest
}) {
    return (
        <Button color={color} variant={variant} {...rest}>
            {children}
        </Button>
    );
}
