import '@cds/core/icon/register.js';
import {
    ClarityIcons,
    userIcon,
    twoWayArrowsIcon,
    vmBugIcon,
} from '@cds/core/icon';

const clarityIcons = [
    userIcon,
    vmBugIcon,
    twoWayArrowsIcon,
]

ClarityIcons.addIcons(...clarityIcons);
