
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('info', {title: 'Info'});
};
