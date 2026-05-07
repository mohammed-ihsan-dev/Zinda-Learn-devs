/**
 * Reusable pagination helper for Mongoose queries
 * @param {Object} model - Mongoose model
 * @param {Object} query - Filter object
 * @param {Object} options - Pagination options (page, limit, sort, populate)
 */
export const paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };
  const populate = options.populate || "";

  const [items, totalItems] = await Promise.all([
    model.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate),
    model.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    }
  };
};
