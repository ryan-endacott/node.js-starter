
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('login', {title: 'I\'m Bored! | CS3380 Database Project'});
};
