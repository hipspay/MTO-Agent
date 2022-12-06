/* eslint-disable indent */
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';

import React from 'react';
import Button from '../Button';

import PropTypes from 'prop-types';

import './style.scss';

const DisputesTable = ({
    disputes,
    columns,
    onPickClick,
    page,
    pageSize,
    setPage,
    setPageSize,
    totalCount,
}) => {
    const handleChangePage = (event, newPage) => {
        setPage(newPage + 1);
    };

    const handleChangePageSize = (event) => {
        setPageSize(+event.target.value);
        setPage(1);
    };

    return (
        <Paper className="disputes-table">
            <TableContainer className="table-container">
                <div className="table-header">
                    {/* <div className="search-input">
                        <Search />
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search..."
                        />
                    </div> */}
                    <p className="total-cnt">
                        Total My disputes:
                        <strong>{totalCount}</strong>
                    </p>
                </div>

                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCell className="table-cell" key={index}>
                                    {column.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {disputes.map((dispute) => (
                            <TableRow
                                hover
                                tabIndex={-1}
                                key={dispute.id}
                            >
                                {columns.map((column, index) => {
                                    const getValue = (dispute, key) => {
                                        const keyArray = key.split('.');
                                        let value = { ...dispute };
                                        keyArray.forEach((item) => {
                                            value = value[item];
                                        });
                                        return value;
                                    };
                                    const value = getValue(dispute, column.key);
                                    return (
                                        <TableCell
                                            className="table-cell"
                                            key={index}
                                        >
                                            <>
                                                {column.key === 'actionBtn' ? (
                                                    <Button onClick={() => onPickClick(dispute)}>Pick</Button>
                                                ) : (
                                                    <span>{value}</span>
                                                )}
                                            </>   
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={totalCount}
                rowsPerPage={pageSize}
                page={page - 1}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangePageSize}
            />
        </Paper>
    );
};

DisputesTable.propTypes = {
    disputes: PropTypes.array,
    columns: PropTypes.array,
    onRowClick: PropTypes.func,
    page: PropTypes.number,
    setPage: PropTypes.func,
    pageSize: PropTypes.number,
    setPageSize: PropTypes.func,
    keyword: PropTypes.string,
    setKeyword: PropTypes.func,
    totalCount: PropTypes.number,
};

DisputesTable.defaultProps = {
    disputes: [],
    columns: [],
    onRowClick: () => {},
    page: 1,
    setPage: () => {},
    pageSize: 10,
    setPageSize: () => {},
    keyword: '',
    setKeyword: () => {},
    totalCount: 0,
};

export default DisputesTable;
