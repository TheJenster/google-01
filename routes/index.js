/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Mircrosft - NSW Traffic Camera Monitoring' });
};