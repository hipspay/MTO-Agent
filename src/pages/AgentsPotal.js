import React, { useState } from 'react';

import './style.scss';
import Spinner from '../components/Spinner/Spinner';
import Button from '../components/Button';
import {
    StepsContainer,
    Participate,
    Waiting,
    Decision,
    ApprovedWaiting,
    DisapprovedWaiting,
    Withdraw,
    Lost,
    Banned,
} from '../components/Steps';
import { Grid, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import escrowABI from '../constants/escrowABI.json';
import tokenABI from '../constants/tokenABI.json';
import { toWei, sleep } from '../utils/index';
import { checkParticipation, checkInit } from '../apis/participation';
import { profile } from '../apis/auth.api';
import { setUserData } from '../store/actions/authActions';

const AgentsPotal = () => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState('init');
    const [isLoading, setIsLoading] = useState(false);

    const [escrowContract, setEscrowContract] = useState(null);
    const [tokenContract, setTokenContract] = useState(null);

    const { web3, account, connected } = useSelector((state) => state.web3);

    const { userData } = useSelector((state) => state.auth);

    const getProfile = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoading(true);
            try {
                const { data } = await profile();
                dispatch(setUserData(data));
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        }
    };

    const WithdrawTokens = async () => {
        try {
            setIsLoading(true);

            await escrowContract.methods
                .agentWithdraw()
                .send({ from: account });

            const endRequestsAt = Date.now() + 120000;
            const result = await verifyInit(endRequestsAt);

            if (result) {
                setStatus('init');
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    React.useEffect(() => {
        if (escrowContract && tokenContract) return;
        if (!connected) return;

        const EscrowContract = new web3.eth.Contract(
            escrowABI,
            process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS
        );

        const TokenContract = new web3.eth.Contract(
            tokenABI,
            process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS
        );

        setEscrowContract(EscrowContract);
        setTokenContract(TokenContract);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [web3]);

    const verifyParticipation = async (timeToEnd) => {
        try {
            const { data } = await checkParticipation();
            console.log(data);
            if (data === true) return true;
            await sleep(2000);
            console.log(Date.now(), timeToEnd, Date.now() > timeToEnd);
            if (Date.now() > timeToEnd && data === false) {
                return false;
            } else {
                return verifyParticipation(timeToEnd);
            }
        } catch (error) {
            console.log(error);
            await sleep(2000);
            if (Date.now() > timeToEnd) {
                return false;
            }
            return verifyParticipation(timeToEnd);
        }
    };

    const verifyInit = async (timeToEnd) => {
        try {
            const { data } = await checkInit();
            console.log(data);
            if (data === true) return true;
            await sleep(2000);
            console.log(Date.now(), timeToEnd, Date.now() > timeToEnd);
            if (Date.now() > timeToEnd && data === false) {
                return false;
            } else {
                return verifyInit(timeToEnd);
            }
        } catch (error) {
            console.log(error);
            await sleep(2000);
            if (Date.now() > timeToEnd) {
                return false;
            }
            return verifyInit(timeToEnd);
        }
    };

    const participate = async () => {
        try {
            setIsLoading(true);
            const amount = toWei(web3, 5);

            await tokenContract.methods
                .approve(process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS, amount)
                .send({ from: account });

            await escrowContract.methods.participate().send({ from: account });

            const endRequestsAt = Date.now() + 120000;
            const result = await verifyParticipation(endRequestsAt);

            if (result) {
                setStatus('waiting');
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const submit = async (decision) => {
        try {
            setIsLoading(true);
            await escrowContract.methods
                .submit(userData.dispute.disputeId, decision)
                .send({ from: account });
            setStatus(
                decision === 3 ? 'pending_approved' : 'pending_disapproved'
            );
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (userData && userData.status) {
            setStatus(userData.status);
        }
    }, [userData]);
    console.log(userData);
    return (
        <>
            <Typography
                variant="body1"
                gutterBottom
                align="right"
                className="score"
            >
                Score: {userData.score}
            </Typography>
            {status === 'init' && (
                <StepsContainer>
                    <Participate mtoToPay={5} mtoToReceive={10} />
                    <Button onClick={participate} disabled={!!!escrowContract}>
                        Participate
                    </Button>
                </StepsContainer>
            )}

            {status === 'waiting' && (
                <StepsContainer>
                    <Waiting />
                    <Button onClick={getProfile}>Reload</Button>
                </StepsContainer>
            )}

            {status === 'review' && userData.dispute ? (
                <StepsContainer>
                    <Decision dispute={userData.dispute} />
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item xs={3}>
                            <Button
                                onClick={() => submit(3)}
                                color="primary"
                                size="large"
                            >
                                Approve
                            </Button>
                        </Grid>
                        <Grid
                            item
                            xs={3}
                            justifyContent="left"
                            alignItems="left"
                        >
                            <Button
                                onClick={() => submit(4)}
                                color="secondary"
                                // style={{ background: '#FFB611' }}
                                size="large"
                            >
                                Disapprove
                            </Button>
                        </Grid>
                    </Grid>
                </StepsContainer>
            ) : (
                status === 'review' &&
                !userData.dispute && (
                    <div className="overlay">
                        <Spinner />
                    </div>
                )
            )}

            {status === 'pending_approved' && (
                <StepsContainer>
                    <ApprovedWaiting dispute={userData.dispute} />
                </StepsContainer>
            )}

            {status === 'pending_disapproved' && (
                <StepsContainer>
                    <DisapprovedWaiting dispute={userData.dispute} />
                </StepsContainer>
            )}

            {status === 'earned' && (
                <StepsContainer>
                    <Withdraw received={10} score={20} />
                    <Button onClick={WithdrawTokens} size="large">
                        Withdraw
                    </Button>
                </StepsContainer>
            )}

            {status === 'lost' && (
                <StepsContainer>
                    <Lost lostScore={20} />
                    <Button onClick={participate} disabled={!!!escrowContract}>
                        Participate
                    </Button>
                </StepsContainer>
            )}

            {status === 8 && <Banned />}

            {isLoading && (
                <div className="overlay">
                    <Spinner />
                </div>
            )}
        </>
    );
};

export default AgentsPotal;
