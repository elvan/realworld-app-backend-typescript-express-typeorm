import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Tag } from '../entities/Tag.entity';
import { TagService } from '../services/tag.service';

// Create repository and service instances
const tagRepository = AppDataSource.getRepository(Tag);
const tagService = new TagService(tagRepository);

export class TagController {
  /**
   * Get all tags
   */
  async getTags(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await tagService.findAll();
      return res.json({ tags });
    } catch (error) {
      next(error);
    }
  }
}

export const tagController = new TagController();
