exports.visualize = function(req, res) {
	res.render('activiz', { title: 'Activity Viz'});
}

exports.upload = function(req, res) {
	res.render('upload', { title: 'Activity Viz'});
}