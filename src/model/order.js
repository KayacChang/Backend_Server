
// ================================

function Order( data ) {
	const {
		index, Account, CheckOut, 
		Time, CoinType, Amount, NewGameMoney, 
		TotalBet, TotalWin
	} = data;

	const id = index;

	const userID = Account.replace('ulg:', '');

	const state = CheckOut ? 'checkout' : 'exchange';

	const exchange = {
		time:		Time * 1000,
		currency:	CoinType,
		amount:		Amount,
		balance:	NewGameMoney,
	};

	const checkout = {
		totalBet:	TotalBet,
		totalWin:	TotalWin,
	};

	return {
		id,
		userID,
		state,

		exchange,

		checkout,
	};
}

module.exports = Order;
