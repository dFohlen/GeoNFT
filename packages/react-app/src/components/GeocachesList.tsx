import * as React from 'react';
import Link from '@material-ui/core/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/material';

interface GeocachesProps {
    geocaches: any[];
}

export const GeocachesList = (props: GeocachesProps) => {
    console.log(props);

    return (
        <Box m={2}>
            <List dense={true}>
                {props.geocaches.map((geocache: any) => (
                    <ListItem
                        key={geocache.publicKey.toString()}
                        button
                        component={Link}
                        href={`http://maps.google.com/maps?q=${geocache.account.location}`}
                    >
                        <ListItemText
                            primary={geocache.account.location}
                            secondary={
                                geocache.distance < 1
                                    ? `${(geocache.distance * 100).toFixed(2)} m`
                                    : `${geocache.distance.toFixed(2)} km`
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
