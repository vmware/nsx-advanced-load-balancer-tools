const mongoose = require('mongoose');

const playbookDetailsSchema = mongoose.Schema({
    playbook_name: String,
    playbook_creation_time: Date,
});

const PlaybookDetailsModel = mongoose.model('PlaybookDetailsModel', playbookDetailsSchema);

module.exports = {
    PlaybookDetailsModel,
};
