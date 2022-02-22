import React from 'react';
import './styles.scss';
import { Typography, Grid } from '@material-ui/core';

const Participate = ({ received, score }) => {
    return (
        <Grid container className="stepContent">
            <Grid item xs={12}>
                <Typography variant="body1" align="center">
                    Congrats!
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" align="center">
                    You earned {received} MTO for reviewing the dispute case.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" align="center">
                    You got {score} Score.
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Participate;
