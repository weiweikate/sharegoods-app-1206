module.exports = {
    dependencies: {
        'react-native-code-push': {
            platforms: {
                android: null // disable Android platform, other platforms will still autolink if provided
            }
        }
    },
    project: {
        ios: {},
        android: {} // grouped into "project"
    },
    assets: ['./path-to-assets'], // stays the same
    commands: require('./path-to-commands.js') // formerly "plugin", returns an array of commands
};
