import * as React from 'react';
import Link from '@material-ui/core/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { ProgramAccount } from '@project-serum/anchor';
import { Box } from '@mui/material';

interface GeocachesProps {
    geocaches: ProgramAccount[];
}

const GeocachesList = (props: GeocachesProps) => {
    console.log(props);

    return (
        <Box m={2}>
            <List dense={true}>
                {props.geocaches.map((geocache) => (
                    <ListItem
                        key={geocache.publicKey.toString()}
                        button
                        component={Link}
                        href={`http://maps.google.com/maps?q=${geocache.account.location}`}
                    >
                        <ListItemText primary={geocache.account.location} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default React.memo(GeocachesList);
