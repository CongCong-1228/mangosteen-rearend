import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException } from '@nestjs/common';
import { Entity, Repository } from 'typeorm';
import { Tags } from './tags.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tags)
    private tagsRepository: Repository<Tags>,
  ) {}
  async findAll(userId, page, pageSize) {
    if (!pageSize) pageSize = 10;
    if (!page) page = 1;
    const skipCount = (page - 1) * pageSize;
    const qb = this.tagsRepository.createQueryBuilder('tags');
    const tags = await qb
      .where('tags.userId = :userId', { userId })
      .skip(skipCount)
      .take(pageSize)
      .getMany();
    return { data: [...tags], page, pageSize };
  }

  async createTag(name, sign, userId) {
    if (!userId) throw new HttpException('用户id必传', 401);
    const createTag = this.tagsRepository.save({ name, sign, userId });
    if (createTag) return { success: '创建成功' };
    throw new HttpException('创建失败', 401);
  }

  async updateTag(name, sign, userId, id) {
    if (!userId) throw new HttpException('用户id不符合要求', 401);
    const qb = this.tagsRepository.createQueryBuilder('tags');
    const userTag = await qb
      .where('userId = :userId', { userId })
      .andWhere('id =:id', { id })
      .getOne();
    if (!userTag) throw new HttpException('没有权限', 401);
    // 使用createQueryBuilder update tag
    const updateSuccess = await qb
      .update(Tags)
      .set({ name, sign })
      .where('id = :id', { id })
      .execute();
    if (updateSuccess) return { data: '更新成功' };
    throw new HttpException('更新失败', 401);
  }

  async deleteTag(userId, id) {
    if (!userId || !id) throw new HttpException('tag不存在', 401);
    const qb = this.tagsRepository.createQueryBuilder('tags');
    const userTag = await qb
      .where('userId = :userId', { userId })
      .andWhere('id = :id', { id })
      .getOne();
    if (!userTag) throw new HttpException('没有权限', 401);
    const deleteSuccess = await qb
      .delete()
      .where('tags.userId = :userId', { userId })
      .andWhere('tags.id = :id', { id })
      .execute();
    if (deleteSuccess) return { data: '删除成功' };
    throw new HttpException('删除失败', 401);
  }

  async queryOneTag(userId, id) {
    if (!userId || !id) throw new HttpException('tag不存在', 401);
    const qb = this.tagsRepository.createQueryBuilder('tags');
    const userTag = await qb
      .where('userId = :userId', { userId })
      .andWhere('id = :id', { id })
      .getOne();
    return userTag;
  }
}
