var path = require('path');
var webpack = require('webpack');

module.exports = {
 	entry: './tictactoe.js',
  	output: {
    	path: path.resolve(__dirname, 'dist'),
    	filename: 'bundle.js',
    	publicPath: '/dist'
	},
  	module: {
  		rules:[
	  		{
	  			test: /\.js?$/,
	  			exclude: '/node_modules/',
	  			loader: 'babel-loader'
	  		},
	  		{
	  			test: /\.css$/,
	  			use: [ 'style-loader', 'css-loader']
	  		}
  		]
	},
  	plugins: [
  		new webpack.optimize.UglifyJsPlugin({
  			// ...
  		})
  	]
};