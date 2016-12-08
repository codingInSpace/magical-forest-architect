const webpack = require('webpack');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry: [
		'webpack-hot-middleware/client',
		'babel-polyfill',
    './src/main.js'
  ],
  output: {
    path: './public/',
    filename: 'bundle.js',
		publicPath: '/public/'
  },
	plugins: [
		//new webpack.optimize.UglifyJsPlugin({minimize: true}),
		new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: [ 'es2015', 'stage-0' ]
				}
			},
			{
				test: /(\.scss|\.css)$/,
				loader: 'style-loader!css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]-[local]___[hash:base64:5]!sass-loader?sourceMap'
			},
			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'raw',
				exclude: /node_modules/
			},
			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'glslify',
				exclude: /node_modules/
			}
		]
  }
};
