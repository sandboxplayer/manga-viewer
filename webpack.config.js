var path = require('path');
var webpack = require('webpack')
module.exports = {
    entry: './src/js/app.js',
    output: {
        filename: 'app-bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['env']
            }
        }],
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader?sourceMap" // translates CSS into CommonJS
            }, {
                loader: "sass-loader", // compiles Sass to CSS
                options: {
                    includePaths: [
                        path.resolve(__dirname, "node_modules/roboto-fontface/fonts")
                    ]
                }
            }]
        }, {
            test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.jpg$/,
            use: [{
                loader: "file-loader"
            }]
        }, {
            test: /\.html$/,
            use: [{
                loader: 'html-loader',
                options: {
                    // minimize: true
                }
            }],
        }, {
            test: /\.png$|http/,
            use: ["url-loader?mimetype=image/png"]
        }]
    },
    resolve: {
        modules: [
            path.resolve("./src"),
            path.resolve("./node_modules")
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        })
    ],
    target: 'node'
};