import colors from '../service/colors';

const type = {
    base: 'Avenir-Book',
    bold: 'Avenir-Black',
}

const size = {
    h1: 38,
    h2: 34,
    h3: 30,
    h4: 26,
    h5: 20,
    regular: 17,
    medium: 14,
    small: 12,
}

const style = {
    h1: {
        // fontFamily: type.bold,
        fontSize: 32,
    },
    h2: {
        // fontFamily: type.base,
        fontSize: 23,
    },
    h3: {
        // fontFamily: type.base,
        fontWeight: '600',
        fontSize: 16,
        color: colors.DARK_GREY
    }
}

export default {
    type,
    size,
    style
}
