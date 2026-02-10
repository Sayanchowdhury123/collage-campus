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

    req.validatedBody = result.data;
    next();
  };
};

export const validateParams = (schema) => (req, res, next) => {
 
  const result = schema.safeParse(req.params);
     
  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message);

    return res.status(400).json({
      message: "Invalid route parameters",
      errorMessages,
    });
  }
  
  req.validatedParams = result.data;
  next();
};

export const QueryValidate = (schema) => {
  return (req, res, next) => {
    if (!req.query) {
      return res.status(400).json({
        message: "Request Query is missing",
      });
    }

    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: result?.error?.issues?.map((issue) => issue?.message),
      });
    }

    req.ValidatedQuery = result.data;
    next();
  };
};
