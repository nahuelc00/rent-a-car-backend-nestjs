function assignImageUrlByEnvironment(filename) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTesting = process.env.NODE_ENV === 'testing';
  const isProduction = process.env.NODE_ENV === 'production';

  let imageUrl = '';

  if (isDevelopment || isTesting)
    imageUrl = `http://localhost:${process.env.PORT}/${filename}`;
  if (isProduction)
    imageUrl = `https://${process.env.PRODUCTION_URL}/${filename}`;

  return imageUrl;
}

export { assignImageUrlByEnvironment };
