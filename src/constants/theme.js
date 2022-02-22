import { createTheme } from '@material-ui/core/styles';
import white from '@material-ui/core/colors/grey';
import grey from '@material-ui/core/colors/grey';

const theme = createTheme({
    palette: {
        action: {
            disabledBackground: '#022853',
            disabled: grey[800],
        },
        primary: {
            main: '#0665d0',
            dark: '#022853',
        },
        secondary: {
            main: '#FFB611',
            contrastText: grey[50],
        },
    },
    components: {
        MuiButton: {},
    },
});
export default theme;
