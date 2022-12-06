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
// import escrowABI from '../constants/escrowABI.json';
// import tokenABI from '../constants/tokenABI.json';
import { toWei, sleep } from '../utils/index';
// import { checkParticipation, checkInit } from '../apis/participation';
// import { profile } from '../apis/auth.api';
import { setUserData } from '../store/actions/authActions';
// import { useSnackbar } from 'notistack';

const notificationConfig = {
    preventDuplicate: true,
    vertical: 'bottom',
    horizontal: 'right',
};
const AgentsPotal = () => {
    const dispatch = useDispatch();
    // const { enqueueSnackbar } = useSnackbar();
    const [status, setStatus] = useState('init');
    const [isLoading, setIsLoading] = useState(false);
    

    // const [escrowContract, setEscrowContract] = useState(null);
    // const [tokenContract, setTokenContract] = useState(null);

    const { web3, account, connected } = useSelector((state) => state.web3);

    const { userData } = useSelector((state) => state.auth);
    const bkdDriver = useSelector((state) => state.driverObject.bkdDriver);
    const scDriver = useSelector((state) => state.driverObject.scDriver);

    // const showNotification = (msg) => {
    //     enqueueSnackbar(msg, {
    //         ...notificationConfig,
    //         variant: 'error',
    //     });
    // };

    const getProfile = async () => {

        try {
            if (!bkdDriver || !bkdDriver.headers)
                return;
        
            setIsLoading(true);
            const profile = await bkdDriver.profile();
            console.log('profile', profile);
            dispatch(setUserData(profile));  
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const WithdrawTokens = async () => {
        try {
            setIsLoading(true);

            const withdraw = await scDriver.agentWithdraw();
            const withdrawReceipt = await withdraw.wait();
            console.log(' withdrawReceipt', withdrawReceipt);
            // await escrowContract.methods
            //     .agentWithdraw()
            //     .send({ from: account });

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

    // React.useEffect(() => {
    //     if (escrowContract && tokenContract) return;
    //     if (!connected) return;

    //     const EscrowContract = new web3.eth.Contract(
    //         escrowABI,
    //         process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS
    //     );

    //     const TokenContract = new web3.eth.Contract(
    //         tokenABI,
    //         process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS
    //     );

    //     setEscrowContract(EscrowContract);
    //     setTokenContract(TokenContract);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [web3]);

    const verifyParticipation = async (timeToEnd) => {
        if (!bkdDriver || !bkdDriver.headers)
            return;
        try {
            const  data  = await bkdDriver.check();
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
        if (!bkdDriver || !bkdDriver.headers)
            return;
        try {
            const data = await bkdDriver.checkInit();
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
        console.log('participate 1');
        try {
            setIsLoading(true);
            const amount = toWei(web3, process.env.REACT_APP_AGENT_PARTICIPATE_AMOUNT);

            const balance = await scDriver.getTokenBalance();
            if(Number(balance.toString()) < Number(amount)) {
                // showNotification('User does not have enough balance.');
                console.log('User does not have enough balance.');
                setIsLoading(false);
                return
            }
            const approve = await scDriver.approve(amount);
            const approveReceipt = await approve.wait();
            console.log(' approve_receipt', approveReceipt);

            // await tokenContract.methods
            //     .approve(process.env.REACT_APP_ESCROW_CONTRACT_ADDRESS, amount)
            //     .send({ from: account });

            // await escrowContract.methods.participate().send({ from: account });
            const participate = await scDriver.participate();
            const participateReceipt = await participate.wait();
            console.log(' participateReceipt', participateReceipt);

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

            console.log(userData.dispute.disputeId, decision)
            setIsLoading(true);

            const submit = await scDriver.submit(userData.dispute.disputeId, decision);
            const submitReceipt = await submit.wait();
            console.log(' submitReceipt', submitReceipt);

            // await escrowContract.methods
            //     .submit(userData.dispute.disputeId, decision)
            //     .send({ from: account });

            
            setStatus(
                decision === 4 ? 'pending_approved' : 'pending_disapproved'
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


    const verifyPickDispute = async (timeToEnd) => {
        if (!bkdDriver || !bkdDriver.headers)
            return;
        try {
            const  profile  = await bkdDriver.profile();
            if (profile.status === 'review') {
                dispatch(setUserData(profile));  
                return true;
            }
            await sleep(2000);

            console.log(Date.now(), timeToEnd, Date.now() > timeToEnd);
            if (Date.now() > timeToEnd && profile === false) {
                return false;
            } else {
                return verifyPickDispute(timeToEnd);
            }
        } catch (error) {
            console.log(error);
            await sleep(2000);
            if (Date.now() > timeToEnd) {
                return false;
            }
            return verifyPickDispute(timeToEnd);
        }
    };


    const pickDispute = async (dispute) => {
        console.log('participate 1');
        try {
            setIsLoading(true);
            
            const pick = await scDriver.pickDispute(dispute.disputeId);
            const pickReceipt = await pick.wait();
            console.log(' pickReceipt', pickReceipt);

            const endRequestsAt = Date.now() + 120000;
            const result = await verifyPickDispute(endRequestsAt);

            if (result) {
                setStatus('review');
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

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
                    <Button onClick={participate} >
                        Participate
                    </Button>
                </StepsContainer>
            )}

            {status === 'waiting' && (
                <StepsContainer>
                    <Waiting 
                    pickDispute={pickDispute}
                    />
                    {/* <Button onClick={getProfile}>Reload</Button> */}
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
                                onClick={() => submit(4)}
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
                                onClick={() => submit(5)}
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
                    <Button onClick={participate}>
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
