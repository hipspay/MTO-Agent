import { House, AmpStories } from '@material-ui/icons';

import React from 'react';

import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';

import { useSelector } from 'react-redux';

import './style.scss';

const menuItems = [
    {
        title: 'Home',
        link: '/',
        icon: <House />,
        authRequired: false,
    },
];

const Sidebar = ({ title, open }) => {
    const isWeb3Connected = useSelector((state) => state.web3.web3connected);

    return (
        <div className={`app-sidebar ${open ? 'opened' : 'closed'}`}>
            <div className="logo">
                <span>{title}</span>
            </div>
            <div className="nav">
                {menuItems.map((menuItem, index) => {
                    if (menuItem.authRequired) {
                        if (isWeb3Connected) {
                            return (
                                <NavLink
                                    className="nav-link"
                                    to={menuItem.link}
                                    activeClassName="active"
                                    key={index}
                                >
                                    {menuItem.icon}
                                    <span>{menuItem.title}</span>
                                </NavLink>
                            );
                        }
                    } else {
                        return (
                            <NavLink
                                className="nav-link"
                                to={menuItem.link}
                                activeClassName="active"
                                key={index}
                            >
                                {menuItem.icon}
                                <span>{menuItem.title}</span>
                            </NavLink>
                        );
                    }
                })}
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    title: PropTypes.string,
    open: PropTypes.bool,
};

Sidebar.defaultProps = {
    title: '',
    open: true,
};

export default Sidebar;
