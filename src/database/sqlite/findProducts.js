// ======================================

// ======================================
const SQL_FIND_ALL_PRODUCT = `
	SELECT
		*
	FROM
		Product
	`;

// ======================================
function findProducts(db) {
    return db
        .prepare(SQL_FIND_ALL_PRODUCT)
        .all();
}

// ======================================
module.exports = findProducts;
