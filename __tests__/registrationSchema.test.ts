import schema from '../validation/registrationSchema';

describe('registration schema', () => {
  it('fails invalid email', async () => {
    await expect(schema.validate({ email: 'wrong' })).rejects.toThrow();
  });

  it('passes valid email', async () => {
    const result = await schema.validate({ email: 'user@example.com' });
    expect(result).toBeTruthy();
  });
});
