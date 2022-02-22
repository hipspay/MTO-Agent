import React from 'react';
import { AiFillSmile } from 'react-icons/ai';
import { Typography, Grid } from '@material-ui/core';

const Waiting = () => {
    return (
        <Grid container className="stepContent">
            <Grid item xs={12}>
                <Typography variant="body1" align="center">
                    Waiting for a dispute case from the system.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" align="center">
                    Please keep a little patience, you will get a case soon.
                </Typography>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <AiFillSmile
                    size={150}
                    style={{ color: 'yellow', marginTop: 80 }}
                />
            </Grid>
        </Grid>
    );
};

export default Waiting;
