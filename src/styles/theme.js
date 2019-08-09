import {createMuiTheme} from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';


const theme = createMuiTheme({
    palette: {
        // type: 'dark',
        primary: green,
        text: {
            primary: '#333',
                // secondary: '#fff',
        }
    }
})

export default theme