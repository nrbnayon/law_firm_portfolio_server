// src/builder/QueryBuilder.ts
import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  /**
   * Search functionality
   */
  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm;

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          field =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  /**
   * Filter functionality
   */
  filter() {
    const queryObj = { ...this.query };

    // Exclude fields that are not for filtering
    const excludeFields = [
      'searchTerm',
      'sort',
      'limit',
      'page',
      'fields',
      'sortBy',
      'sortOrder',
    ];
    excludeFields.forEach(el => delete queryObj[el]);

    // Handle date range filters
    if (queryObj.startDate || queryObj.endDate) {
      const dateFilter: any = {};

      if (queryObj.startDate) {
        dateFilter.$gte = new Date(queryObj.startDate as string);
        delete queryObj.startDate;
      }

      if (queryObj.endDate) {
        dateFilter.$lte = new Date(queryObj.endDate as string);
        delete queryObj.endDate;
      }

      if (Object.keys(dateFilter).length > 0) {
        queryObj.createdAt = dateFilter;
      }
    }

    // Apply filters
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  /**
   * Sort functionality
   */
  sort() {
    let sortBy = '-createdAt'; // Default sort

    if (this.query?.sortBy && this.query?.sortOrder) {
      const sortField = this.query.sortBy as string;
      const sortOrder = this.query.sortOrder as string;
      sortBy = sortOrder === 'desc' ? `-${sortField}` : sortField;
    } else if (this.query?.sort) {
      sortBy = (this.query.sort as string).split(',').join(' ');
    }

    this.modelQuery = this.modelQuery.sort(sortBy);

    return this;
  }

  /**
   * Pagination functionality
   */
  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  /**
   * Field selection
   */
  fields() {
    let fields = '-__v'; // Default exclude __v

    if (this.query?.fields) {
      fields = (this.query.fields as string).split(',').join(' ');
    }

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  /**
   * Count total documents matching the query
   */
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);

    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
    };
  }
}

export default QueryBuilder;
