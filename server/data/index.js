const getUsers = require('./mock/users.json');
const getF5LoginError =  require('./mock/f5loginerror.json');
const getF5MigrationCount =  require('./mock/f5migrationscount.json');
const getReportPageData =  require('./mock/report.json');
const getReadyPageData =  require('./mock/ready.json');
const getF5DestinationData =  require('./mock/f5destination.json');

module.exports = {
    getUsers: getUsers,
    getF5LoginError: getF5LoginError,
    getF5MigrationCount: getF5MigrationCount,
    getReportPageData: getReportPageData,
    getReadyPageData: getReadyPageData,
    getF5DestinationData: getF5DestinationData,
};
