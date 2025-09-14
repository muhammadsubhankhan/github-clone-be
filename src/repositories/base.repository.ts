import { IPaginatedModelResponse } from '@interfaces/paginatedModelResponse.interface';
import { IPaginationDBParams } from '@interfaces/paginationDBParams.interface';
import { FilterQuery, Model, Types } from 'mongoose';
import { BaseModel } from '../models/base.model';

export abstract class BaseRepository<T extends BaseModel> {
  protected model: Model<T>;
  protected defaultOrderByColumn = 'createdAt';
  protected defaultOrderByDirection = 1; // 1 for ASC, -1 for DESC

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findAll(
    whereParams: FilterQuery<T> = {},
    options?: IPaginationDBParams,
    relations?: string[],
  ): Promise<IPaginatedModelResponse<T>> {
    const filter = { ...whereParams, isDeleted: false };

    let query = this.model.find(filter);

    if (relations && relations.length > 0) {
      query = query.populate(relations.join(' '));
    }

    // Apply pagination
    if (options) {
      if (options.limit !== -1) {
        query = query.limit(options.limit).skip(options.offset);
      }
    }

    // Apply sorting
    const sort: any = {};
    sort[this.defaultOrderByColumn] = this.defaultOrderByDirection;
    query = query.sort(sort);

    const [data, count] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter),
    ]);

    return { data, count };
  }

  async findOne(
    whereParams: FilterQuery<T>,
    relations?: string[],
    select?: string,
  ): Promise<T | null> {
    const filter = { ...whereParams, isDeleted: false };
    let query = this.model.findOne(filter);

    if (relations && relations.length > 0) {
      query = query.populate(relations.join(' '));
    }

    if (select) {
      query = query.select(select);
    }

    return query.exec();
  }

  async findById(id: Types.ObjectId, relations?: string[]): Promise<T | null> {
    let query = this.model.findById(id).where({ isDeleted: false });

    if (relations && relations.length > 0) {
      query = query.populate(relations.join(' '));
    }

    return query.exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const created = new (this.model as any)(data);
    return created.save();
  }

  async update(id: Types.ObjectId, data: Partial<T>): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true },
      )
      .exec();
  }

  async delete(id: Types.ObjectId): Promise<boolean> {
    const result = await this.model
      .findByIdAndUpdate(
        id,
        { isDeleted: true, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    return !!result;
  }

  async hardDelete(id: Types.ObjectId): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  async count(whereParams: FilterQuery<T> = {}): Promise<number> {
    const filter = { ...whereParams, isDeleted: false };
    return this.model.countDocuments(filter).exec();
  }
}
