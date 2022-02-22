import React from 'react';
import './styles.scss';
import { Typography, Grid, Container } from '@material-ui/core';

const Decision = ({ dispute }) => {
    return (
        <Grid container className="stepContent">
            <Typography variant="h5" align="center" className="heading">
                Please review the below dispute case.
            </Typography>

            <Grid container>
                <Grid item xs={6}>
                    <Grid container spacing={6}>
                        <Grid item xs={6}>
                            <Typography
                                variant="body1"
                                align="right"
                                className="txt_bold"
                            >
                                Dispute ID
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="left">
                                {dispute.disputeId}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                        <Grid item xs={6}>
                            <Typography
                                variant="body1"
                                align="right"
                                className="txt_bold"
                            >
                                Product Name
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="left">
                                {dispute.order.product.name}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                        <Grid item xs={6}>
                            <Typography
                                variant="body1"
                                align="right"
                                className="txt_bold"
                            >
                                Amount
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="left">
                                {dispute.order.product.price}
                                MTO
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                        <Grid item xs={6}>
                            <Typography
                                variant="body1"
                                align="right"
                                className="txt_bold"
                            >
                                Purchased At
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="left">
                                {dispute.order.createdAt}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container spacing={6}>
                        <Grid item xs={6}>
                            <Typography
                                variant="body1"
                                align="right"
                                className="txt_bold"
                            >
                                Merchant
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="left">
                                {dispute.order.product.merchant.name}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                        <Grid item xs={6}>
                            <Typography
                                variant="body1"
                                align="right"
                                className="txt_bold"
                            >
                                Buyer
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="left">
                                Smith
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                        <Grid item xs={6}>
                            <Typography
                                variant="body1"
                                align="right"
                                className="txt_bold"
                            >
                                Disputed At
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="left">
                                {dispute.createdAt}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                        <Grid item xs={6}>
                            <Typography
                                variant="body1"
                                align="right"
                                className="txt_bold"
                            >
                                Delivery Time
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="left">
                                {dispute.order.deliveryTime}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Container className="descriptionContainer">
                <Typography variant="h6" className="txt_bold">
                    Description from Buyer
                </Typography>
                <Typography variant="body2">{dispute.description}</Typography>
            </Container>
        </Grid>
    );
};

export default Decision;
