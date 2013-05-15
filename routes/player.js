
/*
 * GET player page.
 */

exports.index = function(req, res){
  res.render('player', { title: 'Dick' });
};