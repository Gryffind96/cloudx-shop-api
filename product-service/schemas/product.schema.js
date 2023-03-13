const ProductSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    price: { type: "integer" },
  },
  required: ['title', 'description', 'price'],
  additionalProperties: false,
}

module.exports = ProductSchema