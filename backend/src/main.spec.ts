describe('bootstrap', () => {
  it('should configure app and start listening', async () => {
    const app = {
      enableCors: jest.fn(),
      use: jest.fn(),
      setGlobalPrefix: jest.fn(),
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    const createMock = jest.fn().mockResolvedValue(app);
    const cookieParserMock = jest.fn(() => 'cookie-parser-middleware');

    process.env.PORT = '3010';

    jest.resetModules();
    jest.doMock('@nestjs/core', () => ({
      NestFactory: {
        create: createMock,
      },
    }));
    jest.doMock('cookie-parser', () => cookieParserMock);

    await import('./main');
    await new Promise((resolve) => setImmediate(resolve));

    expect(createMock).toHaveBeenCalled();
    expect(app.enableCors).toHaveBeenCalledWith({
      origin: true,
      credentials: true,
    });
    expect(cookieParserMock).toHaveBeenCalled();
    expect(app.use).toHaveBeenCalledWith('cookie-parser-middleware');
    expect(app.setGlobalPrefix).toHaveBeenCalledWith('api');
    expect(app.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    expect(app.listen).toHaveBeenCalledWith('3010');

    delete process.env.PORT;
  });
});
