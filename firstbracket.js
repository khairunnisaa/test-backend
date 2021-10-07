function findFirstStringInBracket(str) {
    if (str.length > 0) {
        let indexFirstBracketFound = str.indexOf("(");
        let indexClosingBracketFound = str.indexOf(")");
        return str.substring(indexFirstBracketFound+1, indexClosingBracketFound);
    } else {
        return '';
    }
}
console.log(findFirstStringInBracket("aaaaa(abc)dddddeeeee"));