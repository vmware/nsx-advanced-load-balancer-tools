const mongoose = require('mongoose');

const f5DetailsSchema = mongoose.Schema({
    f5_host_ip: String,
    data: {
        f5_host_ip: String,
        f5_ssh_user: String,
        f5_ssh_password: String,
    },
});

const F5DetailsModel  = mongoose.model('F5DetailsModel', f5DetailsSchema);

module.exports = {
    F5DetailsModel,
}
