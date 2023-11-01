const mongoose = require('mongoose');

const aviLabDetailsSchema = mongoose.Schema({
    f5_host_ip: String,
    data: {
        avi_lab_ip: String,
        avi_lab_user: String,
        avi_lab_password: String,
    },
});

const AviLabDetailsModel  = mongoose.model('AviLabDetailsModel', aviLabDetailsSchema);

module.exports = {
    AviLabDetailsModel,
}
