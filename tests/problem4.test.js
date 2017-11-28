/* 
    Napisz funkcję takeFirst(count, ...promises).

    Ma ona zwrócić Promise z tablicą wyników ${count} najszybciej rozwiązanych Promisów. 
    Jeśli żaden Promise nie zostanie podany, wynikiem powinna być pusta tablica.
    W przypadku błędu któregoś z nich (jeśli wymagana liczba Promisów jeszcze się nie rozwiązała), 
    to powinna zwrócić odrzucony Promise z odpowiednim błędem.
    
    Przykład:

    const p1 = resolveInSec(5) // resolves in 5 sec.
    const p2 = resolveInSec(3) // resolves in 3 sec.
    const p3 = resolveInSec(2) // resolves in 2 sec.
    const p4 = resolveInSec(6) // resolves in 6 sec.
    const r1 = rejectInSec(4) // rejects in 4 sec. 

    takeFirst(2, p1, p2, p3, p4, r1).then(console.log) // [p3, p2, p1]

    takeFirst(2, p1, p4, r1).catch(console.log) // error thrown by r1

*/

describe('problem4', () => {
    const setTimeoutPromise = delay => () =>
        new Promise(resolve => {
            setTimeout(() => resolve(delay), delay);
        });

    it('resolves with an array of as many elements as first argument specifies', async () => {
        const result = await takeFirst(
            2,
            Promise.resolve(1),
            Promise.resolve(2),
            Promise.resolve(3),
        );

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(2);
    });

    it('resolves with an empty array if no promises have been passed', async () => {
        expect(await takeFirst(3)).toEqual([]);
    });

    it('resolves with given number of first resolved promises', async () => {
        const promise1 = setTimeoutPromise(500);
        const promise2 = setTimeoutPromise(700);
        const promise3 = setTimeoutPromise(800);
        const promise4 = setTimeoutPromise(1000);

        expect(
            await takeFirst(2, promise1(), promise3(), promise4(), promise2()),
        ).toEqual([500, 700]);
        expect(
            await takeFirst(3, promise1(), promise3(), promise4(), promise2()),
        ).toEqual([500, 700, 800]);
    });

    it('rejects if one of the promises rejects before given number of them has been resolved', async () => {
        const promise1 = setTimeoutPromise(500);
        const promise2 = setTimeoutPromise(700);
        const rejectedPromise = Promise.reject('boom');

        expect.assertions(1);

        try {
            await takeFirst(2, promise1(), promise2(), rejectedPromise);
        } catch (err) {
            expect(err).toBe('boom');
        }
    });
});
