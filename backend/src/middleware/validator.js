export const BodyValidate = (schema) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }

    const result = schema.safeParse(req.body);
    if (!result.success) {
        
      const errorMessages = result.error.issues.map((issue) => issue.message);

      return res.status(400).json({
        message: "Validation failed",
        error: errorMessages,
      });
    }

    req.validatedBody = result.data
    next();
  };
};