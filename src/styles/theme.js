import {createMuiTheme} from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';


const theme = createMuiTheme({
    palette: {
        // type: 'dark',
        primary: {
            main: green[500],
            contrastText: '#fff',
        },
        text: {
            primary: '#333',
                // secondary: '#fff',
        },
    },
    overrides: {
        MuiPaper: {
            rounded: {
                padding: '24px',
            }
        }
    }
})

export default theme