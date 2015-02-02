var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var getWebpackConfig = require('./webpack.config.js');

var uglifyOptions = {
    mangle: true,
    compress: {
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        warnings: false
    }
};

var buildConfig = _.assign(getWebpackConfig(), {
    output: {
        path: path.join(__dirname, '/dist/'),
        publicPath: '/dist/',
        filename: '[name].[hash].js'
    },
});

buildConfig.plugins = buildConfig.plugins.concat(
    new webpack.DefinePlugin({
        'process.env': {
            // This has effect on the react lib size
            'NODE_ENV': JSON.stringify('production')
        }
    }),

    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(uglifyOptions),

    function() {
        this.plugin('done', function(stats) {
            var filename = path.join(__dirname, 'dist', 'stats.json');
            stats = JSON.stringify(stats.toJson(), null, '\t');

            require('fs').writeFileSync(filename, stats);
        });
    }
);

module.exports = buildConfig;