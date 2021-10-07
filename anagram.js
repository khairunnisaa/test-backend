const words = ["kita", "atik", "tika", "aku", "kia", "makan", "kua"];

function getGroupedAnagrams(words) {
    const anagrams = {};
    words.forEach((word) => {
        const sortedWord =  word.split('').sort().join('');
        if (anagrams[sortedWord]) {
            return anagrams[sortedWord].push(word);
        }
        anagrams[sortedWord] = [word];
    });
    return anagrams;
}

const groupedAnagrams = getGroupedAnagrams(words);
let groupedAnagram = [];
for (const sortedWord in groupedAnagrams) {
    groupedAnagram.push(groupedAnagrams[sortedWord]);
}
console.log(groupedAnagram);