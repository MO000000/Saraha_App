export const validation = (schema) => {
  return (req, res, next) => {
    let errResult = [];

    for (const key of Object.keys(schema)) {
      const { error } = schema[key].validate(req[key], { abortEarly: false });
      if (error) {
        error.details.forEach((element) => {
          errResult.push({
            key,
            path: element.path[0],
            message: element.message,
          });
        });
      }
    }

    if (errResult.length > 0) throw new Error(errResult, { cause: 400 });

    next();
  };
};
