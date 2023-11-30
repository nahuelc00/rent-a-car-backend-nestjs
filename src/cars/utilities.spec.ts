import { assignImageUrlByEnvironment } from './utilities';

describe('Utilities', () => {
  it('Should return the url of the image made for the development', () => {
    process.env.NODE_ENV = 'development';

    const imageUrl = assignImageUrlByEnvironment('filename');

    expect(imageUrl).toBe('http://localhost:0000/filename');
  });

  it('Should return the url of the image made for the testing', () => {
    process.env.NODE_ENV = 'testing';

    const imageUrl = assignImageUrlByEnvironment('filename');

    expect(imageUrl).toBe('http://localhost:0000/filename');
  });

  it('Should return the url of the image made for the production', () => {
    process.env.NODE_ENV = 'production';
    process.env.PRODUCTION_URL = 'production.url';

    const imageUrl = assignImageUrlByEnvironment('filename');

    expect(imageUrl).toBe('https://production.url/filename');
  });
});
