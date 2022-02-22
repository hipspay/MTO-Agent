import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Menu, MenuItem, Button } from '@material-ui/core';
import { PermIdentity, Menu as MenuIcon } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';

import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { auth, profile } from '../../../apis/auth.api';

import ConnectButton from '../../ConnectButton/index';
import networks from '../../../constants/networks';

import {
    setWeb3Data,
    clearWeb3Data,
    Web3Object,
    web3Connected,
    setMetaMask,
    setNetwork,
} from '../../../store/actions/web3action';
import { setUserData } from '../../../store/actions/authActions';

import './style.scss';

const Header = ({ toggleSidebar }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { web3, account, balance, connected } = useSelector(
        (state) => state.web3
    );
    const isWeb3Connected = useSelector((state) => state.web3.web3connected);
    const metaMaskAddress = useSelector((state) => state.web3.metaMaskAddress);
    const web3Object = useSelector((state) => state.web3.web3object);

    const providerOptions = {
        walletconnect: {
            display: {
                name: 'Mobile',
            },
            package: WalletConnectProvider,
            options: {
                infuraId: process.env.REACT_APP_INFURA_KEY,
            },
        },
    };

    const web3Modal = new Web3Modal({
        network: 'rinkeby',
        // cacheProvider: true,
        providerOptions, // required
    });

    const disconnectWallet = async () => {
        // logout();
        sessionStorage.removeItem('userConnected');
        sessionStorage.removeItem('userAccount');
        sessionStorage.removeItem('userBalance');
        localStorage.removeItem('walletconnect');
        localStorage.removeItem('connectedWith');
        localStorage.removeItem('accounts');
        localStorage.removeItem('token');
        localStorage.removeItem('connectorId');
        localStorage.removeItem('userConnected');
        localStorage.removeItem('main_access_token');
        localStorage.removeItem('chat_access_token');
        dispatch(web3Connected(false));
        dispatch(Web3Object(''));
        dispatch(setUserData(''));
        dispatch(setMetaMask(''));
        dispatch(
            clearWeb3Data({
                web3: null,
                connected: false,
                balance: null,
                account: null,
            })
        );
        handleClose();
        setAnchorEl(null);

        // window.location.reload()
    };

    const authenticate = async (provider) => {
        try {
            const web3 = new Web3(provider);
            const accounts = await web3.eth.getAccounts();
            const ethers = Web3.utils.fromWei(
                await web3.eth.getBalance(accounts[0]),
                'ether'
            );

            if (
                sessionStorage.getItem('userAccount') &&
                sessionStorage.getItem('userAccount').toLowerCase() ===
                    accounts[0].toLowerCase()
            ) {
                dispatch(Web3Object(web3));
                dispatch(web3Connected(true));
                dispatch(
                    setWeb3Data({
                        web3,
                        connected: true,
                        balance: Number(ethers).toFixed(2),
                        account: accounts[0],
                    })
                );
                return;
            }

            const signature = await web3.eth.personal.sign(
                process.env.REACT_APP_SIGN_STRING,
                accounts[0]
            );
            const result = await auth(signature);
            if (result) {
                localStorage.setItem('token', result.data.token);
                sessionStorage.setItem(
                    'userBalance',
                    Number(ethers).toFixed(2)
                );
                sessionStorage.setItem('userAccount', accounts[0]);
                getProfile();

                dispatch(Web3Object(web3));
                dispatch(web3Connected(true));
                dispatch(
                    setWeb3Data({
                        web3,
                        connected: true,
                        balance: Number(ethers).toFixed(2),
                        account: accounts[0],
                    })
                );
            }
        } catch (error) {
            console.log(error);
            if (error && error.code === 4001) {
                sessionStorage.removeItem('userBalance');
                sessionStorage.removeItem('userAccount');
                sessionStorage.removeItem('userConnected');
                localStorage.removeItem('token');
                localStorage.removeItem('walletconnect');
                localStorage.removeItem('connectedWith');
                localStorage.removeItem('accounts');
                localStorage.removeItem('connectorId');
                localStorage.removeItem('userConnected');

                dispatch(Web3Object(''));
                dispatch(web3Connected(false));
                dispatch(setUserData(''));
                dispatch(setMetaMask(''));
                dispatch(
                    clearWeb3Data({
                        web3: null,
                        connected: false,
                        balance: null,
                        account: null,
                    })
                );
            }
        }
    };

    React.useEffect(() => {
        const savedNetwork = JSON.parse(
            localStorage.getItem(process.env.REACT_APP_CURRENT_NETWORK)
        );
        const dispatchNetwork =
            savedNetwork || networks[process.env.REACT_APP_DEFAULT_NETWORK];
        console.log('dispatchNetwork', dispatchNetwork);
        dispatch(setNetwork(dispatchNetwork));
        // if (metaMaskAddress && Object.keys(web3Object).length !== 0) {
        //   getUserBalance();
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, metaMaskAddress, web3Object]);

    const connectWallet = async (provider) => {
        authenticate(provider);
    };

    const getProfile = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const { data } = await profile();
            dispatch(setUserData(data));
        }
    };

    React.useEffect(() => {
        getProfile();
    }, []);

    return (
        <div className="app-header">
            <div className="container">
                <div>
                    <Button className="toggle-btn" onClick={toggleSidebar}>
                        <MenuIcon />
                    </Button>
                </div>
                <div className="user-menu">
                    {!isWeb3Connected && (
                        <div className="">
                            <ConnectButton
                                connectWallet={connectWallet}
                                handleLogout={disconnectWallet}
                            />
                        </div>
                    )}
                    {isWeb3Connected && (
                        <>
                            <IconButton>
                                <PermIdentity onClick={handleClick} />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>
                                    ETH Address: {account}
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    ETH Balance: {balance}
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    MTO Balance
                                </MenuItem>
                                <MenuItem onClick={disconnectWallet}>
                                    Disconnect
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

Header.propTypes = {
    toggleSidebar: PropTypes.func,
};

Header.defaultProps = {
    toggleSidebar: () => {},
};

export default Header;
