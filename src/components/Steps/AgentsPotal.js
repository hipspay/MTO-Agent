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
} from '../components/Steps';
import { Grid, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import escrowABI from '../constants/escrowABI.json';
import tokenABI from '../constants/tokenABI.json';
import { toWei, sleep } from '../utils/index';
// import { useSnackbar } from 'notistack';
// import { checkParticipation } from '../../apis/participation';

const notificationConfig = {
    preventDuplicate: true,
    vertical: 'bottom',
    horizontal: 'right',
};
const AgentsPotal = () => {
    const [status, setStatus] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    // const { enqueueSnackbar } = useSnackbar();

    // const [escrowContract, setEscrowContract] = useState(null);
    // const [tokenContract, setTokenContract] = useState(null);

    const { web3, account, connected } = useSelector((state) => state.web3);
    const bkdDriver = useSelector((state) => state.driverObject.bkdDriver);
    const scDriver = useSelector((state) => state.driverObject.scDriver);

    // const showNotification = (msg) => {
    //     enqueueSnackbar(msg, {
    //         ...notificationConfig,
    //         variant: 'error',
    //     });
    // };
    const gotoPage3 = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStatus(3);
            setIsLoading(false);
        }, 5000);
    };

    const gotoPage4 = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStatus(4);
            setIsLoading(false);
        }, 5000);
    };

    const gotoPage5 = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStatus(5);
            setIsLoading(false);
        }, 5000);
    };

    const gotoPage6 = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStatus(6);
            setIsLoading(false);
        }, 5000);
    };

    const gotoPage7 = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStatus(7);
            setIsLoading(false);
        }, 5000);
    };

    const gotoPage8 = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStatus(8);
            setIsLoading(false);
        }, 5000);
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
            verifyParticipation(timeToEnd);
        }
    };

    const participate = async () => {
        console.log('participate 2');
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
                setStatus(2);
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
                Score: 100
            </Typography>
            {status === 1 && (
                <StepsContainer>
                    <Participate mtoToPay={5} mtoToReceive={10} />
                    <Button onClick={participate}>
                        Participate
                    </Button>
                </StepsContainer>
            )}

            {status === 2 && (
                <StepsContainer>
                    <Waiting />                    
                </StepsContainer>
            )}

            {status === 3 && (
                <StepsContainer>
                    <Decision />
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item xs={3}>
                            <Button
                                onClick={gotoPage3}
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
                                onClick={gotoPage5}
                                color="secondary"
                                // style={{ background: '#FFB611' }}
                                size="large"
                            >
                                Disapprove
                            </Button>
                        </Grid>
                    </Grid>
                </StepsContainer>
            )}

            {status === 4 && (
                <StepsContainer>
                    <ApprovedWaiting />
                </StepsContainer>
            )}

            {status === 5 && (
                <StepsContainer>
                    <DisapprovedWaiting />
                </StepsContainer>
            )}

            {status === 6 && (
                <div className="card__1">
                    <p className="score-txt txt_20">Score : 120</p>
                    <p className="txt_title mt-80">Congrats!</p>
                    <label className="txt_20">
                        You earned xxx MTO for reviewing the dispute case.
                    </label>
                    <p className="txt_18">You got 20 Score.</p>

                    <button className="part-btn" onClick={() => gotoPage7()}>
                        Withdraw
                    </button>
                </div>
            )}

            {status === 7 && (
                <div className="card__1">
                    <p className="score-txt txt_20">Score : 80</p>
                    <p className="txt_title mt-80">Sorry,</p>
                    <label className="txt_20">
                        You lost a bonus due to the mismatched result.
                    </label>
                    <p className="txt_18">You lost 20 Score.</p>
                    <p className="txt_18" style={{ marginTop: 100 }}>
                        Please try to take a dispute case again.
                    </p>

                    <button className="part-btn" onClick={() => gotoPage8()}>
                        Participate
                    </button>
                </div>
            )}

            {status === 8 && (
                <div className="card__1">
                    <p className="score-txt txt_20">Score : 0</p>
                    <label className="txt_20 mt-80">
                        You are not able to participate to review the dispute
                        case due to the low score.
                    </label>
                </div>
            )}

            {isLoading && (
                <div className="overlay">
                    <Spinner />
                </div>
            )}
        </>
    );
};

export default AgentsPotal;
