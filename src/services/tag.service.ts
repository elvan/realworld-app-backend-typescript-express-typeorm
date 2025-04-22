import { Repository } from 'typeorm';
import { Tag } from '../entities/Tag.entity';

export class TagService {
  private readonly tagRepository: Repository<Tag>;

  constructor(tagRepository: Repository<Tag>) {
    this.tagRepository = tagRepository;
  }

  /**
   * Find all tags
   */
  async findAll(): Promise<string[]> {
    const tags = await this.tagRepository.find();
    return tags.map(tag => tag.name);
  }

  /**
   * Find or create tags by names
   */
  async findOrCreateByNames(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    
    for (const name of tagNames) {
      // Try to find existing tag
      let tag = await this.tagRepository.findOne({ where: { name } });
      
      // Create new tag if it doesn't exist
      if (!tag) {
        tag = this.tagRepository.create({ name });
        await this.tagRepository.save(tag);
      }
      
      tags.push(tag);
    }
    
    return tags;
  }
}
