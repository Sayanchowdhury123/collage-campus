
export const parseProfileNumbers = (req, res, next) => {
  if (req.body) {
   
    const numericFields = ["semester", "batch"];

    numericFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        const num = Number(req.body[field]);
       
        if (!isNaN(num)) {
          req.body[field] = num;
        }
      }
    });
  }
  next();
};