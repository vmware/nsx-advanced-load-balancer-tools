const { spawn } = require('child_process');
const path = require("path")
const fs = require("fs")
const asyncHandler = require('express-async-handler');

const {
    ConversionStatusModel,
    AviOutputModel,
} = require('../models/migration.model');

// Get the IRules list from DB.
exports.getIncompleteIRules = asyncHandler(async (req, res, next) => {
    try {
        const iRules = await aggregateIncompleteIRules();
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
                    "Irule_discovery.Status": "SUCCESSFUL",
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
 * Aggregation to get PARTIAL IRules.
 */
const aggregateIncompleteIRules = async (req, res) => {
    try {
        const incompleteIRulesAggregation = [
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
                    "Irule_discovery.Status": "PARTIAL",
                },
            },
        ]

        const incompleteIRules = await ConversionStatusModel.aggregate(incompleteIRulesAggregation) || [];
        return incompleteIRules;
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
};

exports.getIRulesOverview = asyncHandler(async (req, res, next) => {
    try {
        // TODO: Update query once we have a key to distinguish between multiple converstion objects.

        let incompleteIRules;
        let successfulIRules;
        let migrationCompletedPercentage = 0;
        let successfulIRulesCount = 0;
        let incompleteIRuleCount = 0;

        successfulIRules = await aggregateSuccessfulIRules(req, res);
        incompleteIRules = await aggregateIncompleteIRules(req, res)


        if (successfulIRules && incompleteIRules) {
            if (Array.isArray(successfulIRules)) {
                successfulIRulesCount = successfulIRules.length
            }
            if (Array.isArray(incompleteIRules)) {
                incompleteIRuleCount = incompleteIRules.length;
            }
            if (successfulIRulesCount && (incompleteIRuleCount >= 0)) {
                migrationCompletedPercentage = successfulIRulesCount / (successfulIRulesCount + incompleteIRuleCount) * 100;
                migrationCompletedPercentage = +migrationCompletedPercentage.toFixed(2);
            }

            res.status(200).json({
                reviewedIRules: successfulIRulesCount,
                incompleteIRules: incompleteIRuleCount,
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
