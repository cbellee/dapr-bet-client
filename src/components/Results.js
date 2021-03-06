import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

const user = {
	"email": "cbellee@microsoft.com",
	"id": 3001
}

const apiUrl = "https://dapr-bet.kainiindustries.net/v1.0/invoke/results/method/get"

function Row(props) {
	const { row } = props;
	const classes = useRowStyles();

	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				<TableCell>
				</TableCell>
				<TableCell align="left">{row.place}</TableCell>
				<TableCell align="left">{row.horsename}</TableCell>
				<TableCell align="left">{row.racename}</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

Row.propTypes = {
	row: PropTypes.shape({
		raceid: PropTypes.number.isRequired,
		racename: PropTypes.string.isRequired,
		horseid: PropTypes.number.isRequired,
		horsename: PropTypes.string.isRequired,
		place: PropTypes.number.isRequired,
		odds: PropTypes.string.isRequired,
	}).isRequired,
};

export default function GetResults() {
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch(
			apiUrl,
			{
				method: "GET",
				headers: new Headers({
					Accept: "application/json"
				})
			}
		)
			.then(res => res.json())
			.then(response => {
				setResults(response);
				setIsLoading(false);
			})
			.catch(error => console.log(error));
	}, []);

	return (
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead>
					<TableRow>
						<TableCell></TableCell>
						<TableCell align="left">Place</TableCell>
						<TableCell align="left">Horse</TableCell>
						<TableCell align="left">Race</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{results.map((row, index) => (
						<Row key={index} row={row} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
