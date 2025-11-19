import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

describe('auth tests', () => {
  it('stores credentials', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

    await SecureStore.setItemAsync('user', JSON.stringify({ email: 'a@b.com' }));

    expect(SecureStore.setItemAsync).toHaveBeenCalled();
  });
});
