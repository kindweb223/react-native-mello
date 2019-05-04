import { Platform } from 'react-native'

const images = {
    addProfile: require('../../assets/images/Feed_option/AddPeopleGrey.png'),
    archive: require('../../assets/images/Feed_option/ArchiveGrey.png'),
    delete: require('../../assets/images/Feed_option/DeleteGrey.png'),
    duplicate: require('../../assets/images/Feed_option/DuplicateGrey.png'),
    edit: require('../../assets/images/Feed_option/EditGrey.png'),
    pinGrey: require('../../assets/images/Feed_option/PinGrey.png'),
    pinActive: require('../../assets/images/Feed_option/PinBlue.png'),
    shareLinkGrey: Platform.OS === 'ios' ? require('../../assets/images/Feed_option/ShareLinkGrey.png') : require('../../assets/images/Feed_option/ShareLinkGreyAndroid.png'),
    shareLinkActive: Platform.OS === 'ios' ? require('../../assets/images/Feed_option/ShareLinkBlue.png') : require('../../assets/images/Feed_option/ShareLinkBlueAndroid.png'),
    leave: require('../../assets/images/Feed_option/LeaveGrey.png'),
    placeholder: require('../../assets/images/placeholder.png'),
    iconHashtag: require('../../assets/images/IconHashtag/IconMediumHashtagWhite.png'),
    iconFlow: require('../../assets/images/IconFlow/IconsMediumFlowWhite.png'),
    iconFlowGrey: require('../../assets/images/IconFlow/IconsMediumFlowGrey.png'),
    iconMenu: require('../../assets/images/IconMenu/IconMediumMenuGrey.png'),
    iconPeople: require('../../assets/images/IconPeople/IconsMediumPeopleWhite.png'),
    iconPeopleGrey: require('../../assets/images/IconPeople/IconsMediumPeopleGrey.png'),
    iconPerson: require('../../assets/images/IconPerson/IconsMediumPersonWhite.png'),
    iconPersonGrey: require('../../assets/images/IconPerson/IconsMediumPersonGrey.png'),
    iconMello: require('../../assets/images/IconMello/IconMelloMediumWhite.png'),
    filterGrey: require('../../assets/images/Filter/Grey.png'),
    filterBlue: require('../../assets/images/Filter/Blue.png'),
    closeWhite: require('../../assets/images/Close/White.png')
}

export default images