const { spawn } = require('child_process');
const path = require("path")
const fs = require("fs")
const asyncHandler = require('express-async-handler');
const SUCCESSFUL_STATUS = 'SUCCESSFUL';
const SKIPPED_STATUS = 'SKIPPED';

const {
    ConversionStatusModel,
    AviOutputModel,
} = require('../models/migration.model');

// Get the IRules list from DB.
exports.getSkippedIRules = asyncHandler(async (req, res, next) => {
    try {
        const iRules = await aggregateSkippedIRules();
        if (Array.isArray(iRules) && iRules.length) {
            const result = iRules.map(i => i.Irule_discovery)
            res.status(200).json(result);
        } else {
            res.status(200).json([]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong while retrieving IRules' });
    }
});

/**
 * Aggregation to get SUCCESSFUL IRules.
 */
const aggregateSuccessfulIRules = async (req, res) => {
    try {
        const successfulIRulesAggregation = [
            {
                $project: {
                    Irule_discovery: 1,
                },
            },
            {
                $unwind: {
                    path: "$Irule_discovery",
                },
            },
            {
                $match: {
                    "Irule_discovery.Status": SUCCESSFUL_STATUS,
                },
            },
        ]

        const successfulIRules = await ConversionStatusModel.aggregate(successfulIRulesAggregation) || [];
        return successfulIRules;

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

/**
 * Aggregation to get SKIPPED IRules.
 */
const aggregateSkippedIRules = async (req, res) => {
    try {
        const skippedIRulesAggregation = [
            {
                $project: {
                    Irule_discovery: 1,
                },
            },
            {
                $unwind: {
                    path: "$Irule_discovery",
                },
            },
            {
                $match: {
                    "Irule_discovery.Status": SKIPPED_STATUS,
                },
            },
        ]

        const skippedIRules = await ConversionStatusModel.aggregate(skippedIRulesAggregation) || [];
        return skippedIRules;
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

exports.getIRulesOverview = asyncHandler(async (req, res, next) => {
    try {
        // TODO: Update query once we have a key to distinguish between multiple converstion objects.

        let skippedIRules;
        let successfulIRules;
        let migrationCompletedPercentage = 0;
        let successfulIRulesCount = 0;
        let skippedIRuleCount = 0;

        successfulIRules = await aggregateSuccessfulIRules(req, res);
        skippedIRules = await aggregateSkippedIRules(req, res)


        if (successfulIRules && skippedIRules) {
            if (Array.isArray(successfulIRules)) {
                successfulIRulesCount = successfulIRules.length
            }
            if (Array.isArray(skippedIRules)) {
                skippedIRuleCount = skippedIRules.length;
            }
            if (successfulIRulesCount && (skippedIRuleCount >= 0)) {
                migrationCompletedPercentage = successfulIRulesCount / (successfulIRulesCount + skippedIRuleCount) * 100;
                migrationCompletedPercentage = +migrationCompletedPercentage.toFixed(2);
            }

            res.status(200).json({
                reviewedIRules: successfulIRulesCount,
                skippedIRules: skippedIRuleCount,
                migrationCompletedPercentage
            });
        } else {
            res.status(200).json({});
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
});
