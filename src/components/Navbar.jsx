import React from 'react'
import { Grid, AppBar, Toolbar, Typography } from '@material-ui/core';

const Navbar = () => {

    const styles = {
        appBar: {
            marginBottom: '10px',
        }
    }

    return (
        <AppBar position="static" elevation={2} style={styles.appBar}
            // color={armed ? "primary" : "secondary"}
            color="primary">
            <Toolbar elevation={1}>
                <Typography variant="h5" className="navbrand" >Mission Control</Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;