const Ajv = require("ajv")

const ajv = new Ajv({allErrors: true})

const validate = (schema, data) => {
  const validate = ajv.compile(schema)
  const valid = validate(data)
  if (!valid) console.log(validate.errors)
  return valid ? data : { errors: validate.errors }
};

module.exports = validate;