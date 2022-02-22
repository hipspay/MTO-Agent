import React from 'react';
import './styles.scss';
import { Typography, Grid } from '@material-ui/core';

const Participate = ({ mtoToPay = 0, mtoToReceive = 0 }) => {
    return (
        <Grid container className="stepContent">
            <Grid item xs={12}>
                <Typography variant="body1" align="center">
                    You should pay {mtoToPay} MTO to get a dispute case from the
                    system.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" align="center">
                    Once you win, you will get {mtoToReceive} MTO from the
                    system.
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Participate;
