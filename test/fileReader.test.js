//Require the file for testing
const fileReader = require('../src/fileReader');

//Testing for file reader
describe('File reader tests', () => (
    test('Verify Unsupported Format', async () => {
        let response = await fileReader.processFile('graficas.png', 'palitos');
        expect(response.message).toBe('Format not supported')
    }),

    test('Format CSV', async () => {
        let response = await fileReader.processFile('csv200.csv', 'csv', ',');
        expect(response.original).not.toBeUndefined();
        expect(response.joined).not.toBeUndefined();
    }),

    test('Verify CSV requires separator', async () => {
        try {
            let response = await fileReader.processFile('csv200.csv', 'csv');

        } catch (error) {
            expect(error.message).toBe("Cannot read properties of undefined (reading 'length')");
        }

    }),

    test('Verify format valid TXT', async () => {
        let response = await fileReader.processFile('txt200.txt', 'txt');
        expect(response.original).not.toBeUndefined();
        expect(response.joined).not.toBeUndefined();
    }),

    test('Verify format valid JSON', async () => {
        let response = await fileReader.processFile('json200.json', 'json');
        expect(response.original).not.toBeUndefined();
        expect(response.joined).not.toBeUndefined();
    }),

    test('Verify format valid JsonLine', async () => {
        let response = await fileReader.processFile('jsonline200.jsonl', 'jsonl');
        expect(response.original).not.toBeUndefined();
        expect(response.joined).not.toBeUndefined();
    })
))