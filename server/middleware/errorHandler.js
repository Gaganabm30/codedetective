export function errorHandler(err, req, res, next) {
  console.error('[Server Error Handler]:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

