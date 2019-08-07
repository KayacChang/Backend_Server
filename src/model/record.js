
// ================================
function Round({ scores, plate }) {
	return { scores, result: plate };
}

function Record( date, data ) {
	const {
		index, Account, Time, Msg, IValue1, IValue2
	} = data;

	const uid = date + index;

	const userID = Account.replace('ulg:', '');

	const time = Time * 1000;

	const totalScores = Number( IValue1 );

	const bet = Number( IValue2 );

	const { normalresult, freegame } = JSON.parse( Msg );

	const normalGame = Round( normalresult );

	const featureGame = 
		(freegame) ? freegame.map( Round ) : [];

	return {
		uid,

		userID,

		time,

		bet,
		totalScores,

		normalGame,
		featureGame,
	};
}

module.exports = Record;
