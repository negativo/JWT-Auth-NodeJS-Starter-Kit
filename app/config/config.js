module.exports = {
	'database' : process.env.MONGO_URI,
	'test_database': process.env.TEST_DB_URI,
	'secret': process.env.APP_SECRET,
};
