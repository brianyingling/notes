function upper(strings, ...values) {
    return strings.map((string, i) => {
        if (typeof values[i] === 'string')
            return string + values[i].toUpperCase();
        else if (typeof values[i] === 'undefined')
            return '';
        else
            return string;
    }).join('');
}

const name = 'kyle';
const twitter = 'getify';
const topic = 'JS Recent Parts';

const output = upper`Hello ${name} (@${twitter}), welcome to ${topic}`;

console.log('output:', output);

console.log(
    output === 
    `Hello KYLE (@GETIFY), welcome to JS RECENT PARTS`
);