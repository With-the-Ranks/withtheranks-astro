export const kebabCasetoTitleCase = (str: string) => {
    const wordsArray = str.split('-');
    const capitalizedArray = wordsArray.map(word => {
        // If the word starts with a number, make the whole word uppercase
        return (/^\d/.test(word)) ? word.toUpperCase() :
            (word.charAt(0).toUpperCase() + word.slice(1));
    });

    const title = capitalizedArray.join(' ');
    return title;
};