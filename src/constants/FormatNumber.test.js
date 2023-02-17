import {render, screen, cleanup} from '@testing-library/react'
import { formatNumberToK } from './globalVariables';
import '@testing-library/jest-dom'

afterEach(() => {
    cleanup();
});

describe('number should', () => {
    it("not be formatted number to K", () => {
        let number = 500;
        let expectedResult = String(number);
        expect(formatNumberToK(number)).toEqual(expectedResult);
    });

    it('be formatted to K', () => {
        let number = 1000;
        let expectedResult = '1K';
        expect(formatNumberToK(number)).toEqual(expectedResult);
    });
    it("be formatted number to K", () => {
        let number = 999990;
        let expectedResult = '999.99K';
        expect(formatNumberToK(number)).toEqual(expectedResult);
    });

    it('be formatted to M', () => {
        let number = 1000000;
        let expectedResult = '1M';
        expect(formatNumberToK(number)).toEqual(expectedResult);
    });
    it('be formatted to M', () => {
        let number = 999990000;
        let expectedResult = '999.99M';
        expect(formatNumberToK(number)).toEqual(expectedResult);
    });

    it('be formatted to B', () => {
        let number = 1000000000;
        let expectedResult = '1B';
        expect(formatNumberToK(number)).toEqual(expectedResult);
    });
})