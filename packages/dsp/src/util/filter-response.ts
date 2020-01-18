import { NumericArray } from "@thi.ng/api";
import { cossin, TAU } from "@thi.ng/math";
import { FilterConfig, FilterResponse } from "../api";
import { line } from "../gen/add";
import { exp } from "../gen/mul";
import { magDb } from "./convert";

/**
 * Returns filter response for given filter coefficients at normalized
 * frequency `f`. If `db` is true (default), the magnitude in the
 * returned object will be in dBFS.
 *
 * References:
 *
 * - https://www.earlevel.com/main/2016/12/01/evaluating-filter-frequency-response/
 * - https://www.earlevel.com/main/2016/12/08/filter-frequency-response-grapher/
 * - https://github.com/mohayonao/freqr
 *
 * @param zeroes -
 * @param poles -
 * @param freq -
 * @param db -
 */
export const filterResponseRaw = (
    zeroes: NumericArray,
    poles: NumericArray,
    freq: number,
    db = true
): FilterResponse => {
    const w0 = TAU * freq;
    const [cp, sp] = convolve(poles, w0);
    const [cz, sz] = convolve(zeroes, w0);
    const mag = Math.sqrt((cz * cz + sz * sz) / (cp * cp + sp * sp));
    const phase = Math.atan2(sp, cp) - Math.atan2(sz, cz);
    return { freq, phase, mag: db ? magDb(mag) : mag };
};

export const filterResponse = (
    coeffs: FilterConfig,
    freq: number,
    db?: boolean
) => filterResponseRaw(coeffs.zeroes, coeffs.poles, freq, db);

export const freqRange = (
    fstart: number,
    fend: number,
    steps: number,
    isExp = true
) => (isExp ? exp : line)(fstart, fend, steps).take(steps + 1);

const convolve = (coeffs: NumericArray, w0: number) => {
    let c = 0;
    let s = 0;
    for (let i = coeffs.length; --i >= 0; ) {
        const k = cossin(w0 * i, coeffs[i]);
        c += k[0];
        s += k[1];
    }
    return [c, s];
};