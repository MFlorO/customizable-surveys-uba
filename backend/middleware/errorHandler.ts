
module.exports = function errorHandler(err:any, req:any, res:any, next:any) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({ error: message });
};