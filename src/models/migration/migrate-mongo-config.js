const config = {
    mongodb: {
        
        url: "mongodb://127.0.0.1:27017/node-boilerplate",

        databaseName: "node-boilerplate",

        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },

    migrationsDir: "migrations",

    changelogCollectionName: "changelog",

    migrationFileExtension: ".js",

    useFileHash: false
};

module.exports = config;