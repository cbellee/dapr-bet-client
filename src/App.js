import React, { Fragment, useState, useEffect } from 'react';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useDarkMode } from "./components/UseDarkMode.js"
import { Link, Route, BrowserRouter, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./components/GlobalStyles.js";
import { lightTheme, darkTheme } from "./components/Themes"
import Toggle from "./components/Toggler.js"
import Results from "./components/Results.js"
import Races from './components/Races.js';
import Bets from './components/Bets.js';
import './App.css';

function App() {
	const allTabs = ['/races', '/bets', '/results'];
	const [theme, themeToggler] = useDarkMode();
	const themeMode = theme === 'dark' ? lightTheme : darkTheme;

	return (
		<ThemeProvider theme={themeMode}>
			<GlobalStyles />
			<BrowserRouter>
				<div className="App">
					<Toggle theme={theme} toggleTheme={themeToggler} />
					<Route
						path="/"
						render={({ location }) => (
							<Fragment>
								<Tabs value={location.pathname}>
									<Tab label="Races" value="/races" component={Link} to={allTabs[0]} />
									<Tab label="Bets" value="/bets" component={Link} to={allTabs[1]} />
									<Tab label="Results" value="/results" component={Link} to={allTabs[2]} />
								</Tabs>
								<Switch>
									<Route path={allTabs[0]} render={() => <Races />} />
									<Route path={allTabs[1]} render={() => <Bets />} />
									<Route path={allTabs[2]} render={() => <Results />} />
								</Switch>
							</Fragment>
						)}
					/>
				</div>
			</BrowserRouter>
		</ThemeProvider>

	);
}

export default App;
