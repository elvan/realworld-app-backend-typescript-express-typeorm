import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import { User } from './User.entity';
import { Article } from './Article.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.comments, { eager: true })
  author: User;

  @ManyToOne(() => Article, article => article.comments, { onDelete: 'CASCADE' })
  article: Article;

  // Prepare comment for API response format
  toJSON() {
    return {
      id: this.id,
      body: this.body,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: {
        username: this.author.username,
        bio: this.author.bio || '',
        image: this.author.image || '',
        following: false // This will be set by the service layer
      }
    };
  }
}
