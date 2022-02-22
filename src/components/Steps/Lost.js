import React from 'react';
import './styles.scss';
import { Typography, Grid } from '@material-ui/core';

const Participate = ({ lostScore }) => {
    return (
        <Grid container className="stepContent">
            <Grid item xs={12}>
                <Typography variant="body1" align="center">
                    Sorry,
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" align="center">
                    You lost a bonus due to the mismatched result.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" align="center">
                    You lost {lostScore} Score.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography
                    variant="body1"
                    align="center"
                    style={{ marginTop: 100 }}
                >
                    Please try to take a dispute case again.
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Participate;
