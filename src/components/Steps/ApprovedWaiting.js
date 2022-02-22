import React from 'react';
import { Typography, Grid, Container } from '@material-ui/core';
import './styles.scss';

const DecisionApproved = ({ dispute }) => {
    return (
        <Grid container className="stepContent">
            <span className="status">
                <Typography variant="h5" align="center">
                    Approved
                </Typography>
            </span>
            <Typography variant="h5" align="center" className="heading">
                Waiting for the result from an another agent ...
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
                <Typography variant="h6" className="txt_bold" align="center">
                    Description from Buyer
                </Typography>
                <Typography variant="body2">{dispute.description}</Typography>
            </Container>

            <Container className="descriptionContainer">
                <Typography variant="body1" className="info" align="center">
                    if another agent submit the same result, you will both get
                    earned from the system
                </Typography>
                <Typography variant="body1" className="info" align="center">
                    if another agent submits the different result, you will both
                    never get any bonus from the system
                </Typography>
            </Container>
        </Grid>
    );
};

export default DecisionApproved;
