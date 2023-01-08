export default class XlsHelper {

    static getColumnNameByNumber(columnNumber) {
        let columnName = [];
        while (columnNumber > 0) {

            // Find remainder
            let rem = columnNumber % 26;

            // If remainder is 0, then a
            // 'Z' must be there in output
            if (rem == 0) {
                columnName.push("Z");
                columnNumber = Math.floor(columnNumber / 26) - 1;
            }
            else // If remainder is non-zero
            {
                columnName.push(String.fromCharCode((rem - 1) + 'A'.charCodeAt(0)));
                columnNumber = Math.floor(columnNumber / 26);
            }
        }
        return columnName.join('')
    }
}
