module.exports = app => {
	app.get("/", (req,res) => res.render("index"));
	app.get('/nav', (req,res) => res.render('partials/default_nav',{layout:false}));
	app.get('/top5', (req,res) => {
		let ids = 
	});
};