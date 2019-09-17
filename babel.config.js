const plugins = [];
if (process.env.NODE_ENV === 'production') {
    plugins.push('transform-remove-console');
}
module.exports = {
    'presets': [
        'module:metro-react-native-babel-preset'
    ],
    'plugins': [
        ...plugins,
        [
            '@babel/plugin-proposal-decorators',
            {
                'legacy': true
            }
        ]
    ]
};
