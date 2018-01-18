/**
 * Napisz funkcję 'attempt', która przymuje jako jedyny argument listę funkcji, z których
 * każda zwraca Promise'a. 'attempt' powinien wywołać pierwszą funkcję i jeśli zwrócony
 * Promise zakończył się błędem, wywołać kolejną funkcję z listy, aż któryś Promise zwróci
 * poprawny wynik. 'attempt' powinien zwrócić ten wynik i nie wywoływać już dalszych funkcji.
 *
 * Przykładowo wywołanie:
 *
 * attempt([
 *   () => p.rejectWith(1).after(10),
 *   () => p.resolveWith(5).after(50),
 *   () => p.resolveWith(10).after(100)
 * ]);
 *
 * powinno zwrócić Promise, który rozwiąże się do wartości 5. Trzecia podana funkcja nie powinna
 * w ogóle zostać wywołana.
 *
 * Spróbuj napisać tą funkcję zarówno z async/await jak i bez. Które rozwiązanie jest twoim zdaniem
 * czytelniejsze?
 *
 * PYTANIE DODATKOWE: Czy wiesz, czemu 'attempt' musi przyjmować listę funkcji? Czemu nie mógłby
 * przyjmować po prostu listy Promise'ów?
 */

const p = require('../utils.js');

describe('problem2', () => {
     var attempt = async (arr)=>{
        var f = arr.shift();
        try {
            return await f();
        } catch(er) {
            if (arr.length) {
                return attempt(arr);
            } else {
                throw er;
            }
        }            
    }


    it('properly resolves with just one promise', async () => {
        const result = await attempt([
            () => p.resolveWith(1).after(10)
        ]);

        expect(result).toEqual(1);
    });

    it('returns value of first promise that resolves', async () => {
        const result = await attempt([
            () => p.rejectWith(1).after(10),
            () => p.resolveWith(5).after(50),
            () => p.resolveWith(10).after(100)
        ]);

        expect(result).toEqual(5);
    });

    it('does not call functions after resolved one', async () => {
        const fn3 = jest.fn();
        await attempt([
            () => p.rejectWith(1).after(10),
            () => p.resolveWith(5).after(50),
            fn3
        ]);

        expect(fn3.mock.calls.length).toBe(0);
    });

    it('rejects with last error if all promises rejected', async (done) => {
        try {
            await attempt([
                () => p.rejectWith(1).after(10),
                () => p.rejectWith(5).after(50),
                () => p.rejectWith(10).after(100)
            ]);
        } catch (e) {
            expect(e).toEqual(10);
            done();
        }
    });
});
