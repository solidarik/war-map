class GeoHelper {
    fromLonLat(input) {
        const RADIUS = 6378137
        const HALF_SIZE = Math.PI * RADIUS;
        const halfSize = HALF_SIZE;
        const length = input.length;
        const dimension = 2;
        let output = [];
        for (let i = 0; i < length; i += dimension) {
            output[i] = halfSize * input[i] / 180;
            let y = RADIUS * Math.log(Math.tan(Math.PI * (input[i + 1] + 90) / 360));

            if (y > halfSize) {
                y = halfSize;
            } else if (y < -halfSize) {
                y = -halfSize;
            }
            output[i + 1] = y;
        }
        return output;
    }
}

module.exports = new GeoHelper();