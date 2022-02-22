import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from './Header/Header';
import Sidebar from './Sidebar/index';

import './style.scss';

const Layout = ({ title, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="app-container">
            <Sidebar open={isSidebarOpen} title={title} />
            <div className="main-view">
                <Header toggleSidebar={toggleSidebar} />
                <div className="main-content">{children}</div>
            </div>
        </div>
    );
};

Layout.propTypes = {
    title: PropTypes.string,
    children: PropTypes.any,
};

Layout.defaultProps = {
    title: '',
    children: '',
};

export default Layout;
