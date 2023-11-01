const mongoose = require('mongoose');

const playbookDetailsSchema = mongoose.Schema({
    f5_host_ip: String,
    playbooks: [{
        playbook_name: String,
        playbook_creation_time: Date,
    }],
});

const PlaybookDetailsModel = mongoose.model('PlaybookDetailsModel', playbookDetailsSchema);

module.exports = {
    PlaybookDetailsModel,
};
