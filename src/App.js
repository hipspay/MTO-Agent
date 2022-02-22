import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainLayout from './components/MainLayout/MainLayout';
import AgentsPotalPage from './pages/AgentsPotal';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import store, { history } from './store';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './constants/theme';
import './App.scss';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Router>
                        <Switch>
                            <MainLayout>
                                <Route
                                    path="/"
                                    exact
                                    component={AgentsPotalPage}
                                ></Route>
                            </MainLayout>
                        </Switch>
                    </Router>
                </ConnectedRouter>
            </Provider>
        </ThemeProvider>
    );
}

export default App;
