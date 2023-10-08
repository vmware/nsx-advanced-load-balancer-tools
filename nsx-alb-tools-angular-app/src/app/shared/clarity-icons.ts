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
    exclamationCircleIcon,
} from '@cds/core/icon';

const clarityIcons = [
    userIcon,
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
    exclamationCircleIcon,
]

ClarityIcons.addIcons(...clarityIcons);
