const crypto = require('crypto');
const { v4 } = require('uuid');

test('UUID v4 generation', () => {
  const uuid = uuidv4();
  expect(uuid).toHaveLength(36);
});
