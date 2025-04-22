import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Index
} from 'typeorm';
import { Article } from './Article.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  name: string;

  @ManyToMany(() => Article, article => article.tags)
  articles: Article[];
}
