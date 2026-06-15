import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(
    ({ level, message, timestamp, stack }) => {
      return `[${timestamp}] ${level}: ${stack || message}`;
    }
  )
);

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    // Write all error logs to error.log
    new winston.transports.File({ 
      filename: path.join(__dirname, "../../logs/error.log"), 
      level: "error" 
    }),
    // Write all combined logs to combined.log
    new winston.transports.File({ 
      filename: path.join(__dirname, "../../logs/combined.log") 
    }),
    // Log to console with colors
    new winston.transports.Console({
      format: consoleFormat
    })
  ],
});

export default logger;
