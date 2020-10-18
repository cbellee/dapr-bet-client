import React, { Fragment, useState, useEffect, FormEvent } from 'react'
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Input from '@material-ui/core/Input';
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import InputAdornment from '@material-ui/core/InputAdornment'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const apiUrl = "http://dapr-bet.kainiindustries.net/v1.0/invoke/bets/method/add"

export default function BetCartDialog(props) {
	const { bets } = props;
	const { addBetHandler } = props;
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState([]);

	function saveBet(bet) {
		console.log(bet)
		return fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: bet,
		})
			.then(data => data.json())
	}

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		var i = 0;
		var arr = [];
		var object = {};

		// convert form fields into JSON object array of 'bets'
		const formData = new FormData(document.getElementById("bet-dialog-form"));
		formData.forEach((value, key) => {
			let k = key.split('-');

			if (i == parseInt(k[1])) {
				console.log(object[k[0]])
				if (!isNaN(value)) {
					object[k[0]] = parseInt(value, 10);
				} else {
					object[k[0]] = value;
				};
			} else if (i < parseInt(k[1])) {
				arr.push(object);
				object = {};
				if (object[k[0]] === "raceid" || object[k[0]] === "horseid") {
					object[k[0]] = parseInt(value, 10);
				}
				i += 1;
			} else {
				arr.push(object);
			}
		});
		arr.push(object);
		console.log(arr);

		// iterate through bets abd POST each ot the api server
		arr.map((bet, i) => {
			console.log("saving bet: %v", bet)
			saveBet(JSON.stringify(bet))
		});

		// close the dialog
		setOpen(false);
	}

	return (
		<MuiThemeProvider>
			<Fragment>
				<Tooltip title="Add">
					<IconButton aria-label="add" onClick={handleClickOpen}>
						<AddIcon />
					</IconButton>
				</Tooltip>
				<Dialog
					open={open}
					onClose={handleClose}
					fullWidth={true}
					maxWidth={'md'}
				>
					<DialogContent>
						<DialogTitle id="form-dialog-title">{bets.map((b, i) => (b.racename)).filter((b, index, a) => a.indexOf(b) == index)}</DialogTitle>
						<TableContainer component={Paper}>
							<form onSubmit={handleSubmit} id="bet-dialog-form">
								<Table aria-label="collapsible table">
									<TableHead>
										<TableRow>
											<TableCell align="left">Horse</TableCell>
											<TableCell align="left">Odds</TableCell>
											<TableCell align="left">Bet Type</TableCell>
											<TableCell align="left">Bet Amount</TableCell>
											<TableCell align="left"></TableCell>
											<TableCell align="left"></TableCell>
											<TableCell align="left"></TableCell>
											<TableCell align="left"></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{
											bets.map((b, i) => (
												<TableRow>
													<TableCell>
														<TextField
															readonly
															type="text"
															name={"horsename-" + i}
															key={"horsename-" + i}
															value={b.horsename}
														>
														</TextField>
													</TableCell>
													<TableCell>
														<TextField
															readonly
															type="text"
															name={"odds-" + i}
															key={"odds-" + i}
															value={b.odds}
														>
														</TextField>
													</TableCell>
													<TableCell>
														<TextField
															select
															name={"type-" + i}
															key={"type-" + i}
															onChange={e => setValue(e.currentTarget.value)}
															SelectProps={{
																native: true,
															}}
														>
															{b.type.map(item => (
																<option
																	key={item}
																	value={item}
																>
																	{item}
																</option>
															))}
														</TextField>
													</TableCell>
													<TableCell>
														<Input
															name={"amount-" + i}
															key={"amount-" + i}
															type="number"
															min="1"
															max="999"
															startAdornment={<InputAdornment position="start">$</InputAdornment>}
															onChange={e => setValue(e.currentTarget.value)}
														></Input>
													</TableCell>
													<TableCell>
														<input
															readonly
															hidden
															type="text"
															name={"email-" + i}
															key={"email-" + i}
															value={b.email}
														>
														</input>
													</TableCell>
													<TableCell>
														<input
															readonly
															type="text"
															hidden
															name={"raceid-" + i}
															key={"raceid-" + i}
															value={b.raceid}
														>
														</input>
													</TableCell>
													<TableCell>
														<input
															readonly
															hidden
															type="text"
															name={"racename-" + i}
															key={"racename-" + i}
															value={b.racename}
														>
														</input>
													</TableCell>
													<TableCell>
														<input
															readonly
															type="text"
															hidden
															name={"horseid-" + i}
															key={"horseid-" + i}
															value={b.horseid}
														>
														</input>
													</TableCell>
												</TableRow>
											))
										}
									</TableBody>
								</Table>
							</form>
						</TableContainer>
						<DialogActions>
							<Button onClick={handleSubmit} type="submit" value="Submit">
								Submit
							</Button>
							<Button onClick={handleClose} color="primary">
								Cancel
          					</Button>
						</DialogActions>
					</DialogContent>
				</Dialog>
			</Fragment>
		</MuiThemeProvider>
	)
}
