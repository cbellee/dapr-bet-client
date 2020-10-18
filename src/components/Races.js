import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Checkbox from '@material-ui/core/Checkbox';
import BetCartDialog from './BetCartDialog.js'

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

const apiUrl = "http://dapr-bet.kainiindustries.net/v1.0/invoke/races/method/get"

function Row(props) {
	const { row } = props;
	const [cart, setCart] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
	const [selected, setSelected] = React.useState([]);
	const classes = useRowStyles();
	const isSelected = (name) => selected.indexOf(name) !== -1;
	let newSelected = [];

	useEffect(() => {
		AddBetsToCart(row)
	}, [selected]);

	useEffect(() => {
	}, [cart]);

	const handleClick = (event, name, row) => {
		const selectedIndex = selected.indexOf(name);

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		setSelected(newSelected);
	}

	function AddBetsToCart(row) {
		console.log(selected.length + " bets added to cart")

		let betArr = new Array();
		selected.map((s, i) => (
			row.runners[s].email = user.email,
			row.runners[s].raceid = parseInt(row.raceid),
			row.runners[s].racename = row.racename,
			row.runners[s].trackname = row.trackname,
			row.runners[s].type = ["WIN", "PLACE", "EACHWAY"],
			row.runners[s].time = row.time,
			row.runners[s].amount = parseInt(0),
			betArr.push(row.runners[s])
		))

		setCart(betArr);
		return betArr
	}

	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell align="left">{row.racename}</TableCell>
				<TableCell align="left">{row.trackname}</TableCell>
				<TableCell align="left">{row.time}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell align="left">Select</TableCell>
										<TableCell align="left">Horse</TableCell>
										<TableCell align="left">Jockey</TableCell>
										<TableCell align="left">Odds</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>

									{row.runners.map((runnersRow, index) => (
										<TableRow key={index}>
											<TableCell padding="checkbox">
												<Checkbox
													hover
													onClick={(event) => handleClick(event, index, row)}
													role="checkbox"
													aria-checked={isSelected(index)}
													tabIndex={-1}
													key={row.horseid}
													selected={isSelected(index)}
													inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${index}` }}
												/>
											</TableCell>
											<TableCell>{runnersRow.horsename}</TableCell>
											<TableCell align="left">{runnersRow.jockey}</TableCell>
											<TableCell align="left">{runnersRow.odds}</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell>
											<BetCartDialog bets={cart} />
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

Row.propTypes = {
	row: PropTypes.shape({
		raceid: PropTypes.number.isRequired,
		racename: PropTypes.string.isRequired,
		trackname: PropTypes.string.isRequired,
		runners: PropTypes.arrayOf(
			PropTypes.shape({
				horseid: PropTypes.number.isRequired,
				horsename: PropTypes.string.isRequired,
			}),
		).isRequired,
	}).isRequired,
};

export default function Races() {
	const [races, setRaces] = useState([]);
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
				setRaces(response);
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
						<TableCell align="left">Race</TableCell>
						<TableCell align="left">Track</TableCell>
						<TableCell align="left">Time</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{races.map((row, index) => (
						<Row key={index} row={row} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
