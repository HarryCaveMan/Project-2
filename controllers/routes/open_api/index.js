gdb = require('../../groupController');
module.exports = app => {
	app.get("/", (req,res) => {
        let top5 = gdb.searchPopularGroups();
		let dataOut = {};
		for(let i=0 ; i<top5.length ; i++){
			dataOut[`id${i+1}`]=top5[i].id;
			dataOut[`count${i+1}`] = top5[i].members;
		}
		res.render("index",dataOut);
	});
	app.get('/nav', (req,res) => res.render('partials/default_nav',{layout:false}));
	app.get('/top5', (req,res) => {
		
		res.render('partials/top5',{dataOut,layout:false});        
	});
};