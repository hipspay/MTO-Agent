import React from 'react';
import { Container, Grid } from '@material-ui/core';

const StepsContainer = ({ children }) => {
    return (
        <Container maxWidth="md">
            <Grid container justifyContent="center" alignItems="center">
                {children}
            </Grid>
        </Container>
    );
};

export default StepsContainer;
