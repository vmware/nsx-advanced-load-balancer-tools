import '@cds/core/icon/register.js';
import {
    ClarityIcons,
    userIcon,
    twoWayArrowsIcon,
    vmBugIcon,
    barsIcon,
} from '@cds/core/icon';

const clarityIcons = [
    userIcon,
    vmBugIcon,
    twoWayArrowsIcon,
    barsIcon,
]

ClarityIcons.addIcons(...clarityIcons);
