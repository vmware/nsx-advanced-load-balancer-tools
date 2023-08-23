const mongoose = require('mongoose');

const sheetSchema = mongoose.Schema({
    status_sheet: [{
        index: Number,
        F5_type: String,
        F5_SubType: String,
        F5_ID: String,
        Status: String,
        Skipped_settings: String,
        Indirect_mapping: String,
        Not_Applicable: String,
        User_Ignored: String,
        Skipped_for_defaults: String,
        Complexity_Level: {
            type: String,
            default: null, // This allows the field to have a string value or be null
        },
        F5_Object: String,
        Avi_Object: String,
        Needs_Review: {
            type: String,
            default: null, // This allows the field to have a string value or be null
        }
    }],
    pivot_sheet:[{
        Status: String,
        F5_type: String,
        F5_SubType: String,
        len: Number,
    }]
})

module.exports = mongoose.model('sheet', sheetSchema);