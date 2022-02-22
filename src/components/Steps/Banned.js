import React from 'react';
import './styles.scss';
import { Typography, Grid } from '@material-ui/core';

const Participate = () => {
    return (
        <Grid container className="stepContent">
            <Grid item xs={12}>
                <Typography variant="body1" align="center">
                    You are not able to participate to review the dispute case
                    due to the low score.
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Participate;
