import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique
} from 'typeorm';
import { User } from './User.entity';
import { Article } from './Article.entity';

@Entity('article_favorites')
@Unique(['user', 'article'])
export class ArticleFavorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Article, article => article.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @CreateDateColumn()
  createdAt: Date;
}
