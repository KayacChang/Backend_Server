
// ==============================
const API = '/products';

// ==============================

function main( { server, databases } ) {

	server.get( API, getProducts );

	console.log(`API [ ${ API } ] get ready.`);

	// ==============================

	async function getProducts( req, res, next ) {
		const result = databases.cms.findProduct();

		const tasks = result.map( async ( product ) => {
			const database = databases[ product.name ];

			const tableList = await database.getTableList();

			const tasks = tableList.map( async ( table ) => {
				const name = table[ 'TABLE_NAME' ];

				const rows = await database.getHistoryCount( name );

				return { name, rows };
			});

			product.tables = await Promise.all( tasks )
		});

		await Promise.all( tasks );

		res.send( result );

		return next();
	}

}

// ==============================
module.exports = main;
