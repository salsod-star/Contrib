class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    // Query Filtering
    const queryObj = { ...this.queryStr };
    const excludedFields = ["page", "sort", "limit", "fields"];

    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced Query Filtering
    let queryString = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (matchedWord) => `$${matchedWord}`
    );

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    // Sorting
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    // Field limiting
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const limit = this.queryStr.limit * 1 || 30;
    const page = this.queryStr.page * 1 || 1;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
