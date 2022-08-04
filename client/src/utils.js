export const datesAreEqual = (first, second) => {
    if (!first || !second || !(first instanceof Date) || !(second instanceof Date)) return false;
    return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
};
