import logger from "../services/logger.service.js";

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request arrival
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`;
    
    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
};
