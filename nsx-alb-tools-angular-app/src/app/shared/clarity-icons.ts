import '@cds/core/icon/register.js';
import {
    ClarityIcons,
    userIcon,
    networkSwitchIcon,
    twoWayArrowsIcon,
    vmBugIcon,
    barsIcon,
    vmwAppIcon,
    listIcon,
    mapIcon,
    mapMarkerIcon,
    cloudTrafficIcon,
    shieldIcon,
    bookIcon,
    downloadIcon,
    checkIcon,
    exclamationCircleIcon,
    checkboxListIcon,
    flaskIcon,
} from '@cds/core/icon';

const clarityIcons = [
    userIcon,
    checkboxListIcon,
    flaskIcon,
    vmBugIcon,
    vmwAppIcon,
    twoWayArrowsIcon,
    barsIcon,
    networkSwitchIcon,
    listIcon,
    mapIcon,
    mapMarkerIcon,
    cloudTrafficIcon,
    shieldIcon,
    bookIcon,
    downloadIcon,
    checkIcon,
    exclamationCircleIcon,
]

ClarityIcons.addIcons(...clarityIcons);
