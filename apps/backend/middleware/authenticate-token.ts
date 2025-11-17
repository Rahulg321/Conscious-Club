import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  console.log("inside authenticate token");

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).json({
      error: "Not Authenticated",
      code: "NO_AUTH_HEADER"
    });
    return;
  }

  // Validate Bearer token format
  if (!authHeader.startsWith("Bearer ") || authHeader.split(" ").length !== 2) {
    res.status(401).json({
      error: "Invalid authorization header format. Expected 'Bearer <token>'",
      code: "INVALID_AUTH_FORMAT"
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token || token.trim() === "") {
    res.status(401).json({
      error: "Authorization token is missing",
      code: "MISSING_TOKEN"
    });
    return;
  }

  // Validate AUTH_SECRET is set
  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) {
    console.error("❌ AUTH_SECRET environment variable is not set");
    res.status(500).json({
      error: "Server configuration error",
      code: "SERVER_CONFIG_ERROR",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, authSecret);
    (req as any).user = decoded;

    console.log("successfully authenticated token");

    next();
  } catch (error) {
    console.log("An error occurred trying to authenticate token", error);
    if (error instanceof jwt.JsonWebTokenError) {
      console.log("An error occurred trying to authenticate token", error);
      res.status(401).json({
        error: error.message,
        code: "INVALID_TOKEN"
      });
      return;
    }
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
      code: "INTERNAL_ERROR",
    });
    return;
  }
};

export default authenticateToken;
