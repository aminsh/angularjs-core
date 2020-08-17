export const keyboard = {
    ENTER: 13,
    SHIFT: 16,
    ARROW_RIGHT: 39,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    DELETE: 46,
    INSERT: 45,
    BACKSPACE: 8,
    F2: 113,
    F4: 115
};

export function getName(key) {
    return ( Object
        .keys(keyboard)
        .map(k => ( { key: k, value: keyboard[ k ] } ))
        .filter(item => item.key === key)[ 0 ] || {} )
        .value;
}