import React, { useEffect, useState } from 'react';
import { AiFillSmile } from 'react-icons/ai';
import { Typography, Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Spinner from '../Spinner/Spinner';
import DisputesTable from '../DisputesTable';
import Button from '../Button';

const DisputesColumns = [
    {
        title: 'Id',
        key: 'id',
    },
    {
        title: 'appliedAgentsCount',
        key: 'appliedAgentsCount',
    },
    {
        title: 'disputeId',
        key: 'disputeId',
    },
    {
        title: 'Created At',
        key: 'createdAt',
    },
    {
        title: 'disputeReviewGroupCount',
        key: 'disputeReviewGroupCount',
    },
    {
        title: 'reviewCount',
        key: 'reviewCount',
    },
    {
        title: 'Pick',
        key: 'actionBtn',
    }
];

const Waiting = ({pickDispute}) => {
    const [disputes, setDisputes] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const bkdDriver = useSelector((state) => state.driverObject.bkdDriver);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const getDisputes = async () => {
        setIsLoading(true);
        const dispute = await bkdDriver.getDisputes({ page: page, limit: 20 });
        console.log('dispute', dispute);
        setDisputes(dispute.disputes);
        setTotalCount(dispute.totalCount);
        setIsLoading(false);
    };

    useEffect(() => {
        console.log('Waiting');
        getDisputes();
    }, []);

    const onPickClick = (dispute) => {
        console.log('dispute', dispute);
        pickDispute(dispute);
    }



    return (
        <>
            {isLoading ? (
                <div className="overlay">
                    <Spinner />
                </div>
            ) : (
                <>
                    {disputes.length > 0 ? (
                        <DisputesTable
                            columns={DisputesColumns}
                            disputes={disputes}
                            onPickClick={onPickClick}
                            page={page}
                            setPage={setPage}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            totalCount={totalCount}
                        />
                    ) : (
                        <>
                            <Grid container className="stepContent">
                                <Grid item xs={12}>
                                    <Typography variant="body1" align="center">
                                        There was no pending disputes.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" align="center">
                                       Click reload to see if any new comes.
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    style={{ textAlign: 'center' }}
                                >
                                    <AiFillSmile
                                        size={150}
                                        style={{
                                            color: 'yellow',
                                            marginTop: 80,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Button onClick={getDisputes}>Reload</Button>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Waiting;
