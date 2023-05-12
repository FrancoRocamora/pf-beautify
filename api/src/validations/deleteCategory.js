const { Category } = require("../db");

const deleteCategoryValidation = async (req, res, next) => {
  const id = Number(req.params.id);
  if (String(id) === "NaN")
    return res.status(400).json({ error: "id must be a number" });
  if (!id) return res.status(400).json({ error: "id required" });
  if (Math.floor(id) !== id)
    return res.status(400).json({ error: "id must be an integer" });

  const oldCategory = await Category.findByPk(id);
  if (!oldCategory)
    return res.status(400).json({ error: "category not found" });

  next();
};

module.exports = deleteCategoryValidation;
