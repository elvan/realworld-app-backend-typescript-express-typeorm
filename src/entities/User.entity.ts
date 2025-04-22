import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Article } from './Article.entity';
import { Comment } from './Comment.entity';
import { UserFollow } from './UserFollow.entity';
import { ArticleFavorite } from './ArticleFavorite.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, default: '' })
  bio: string;

  @Column({ nullable: true, default: '' })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Article, article => article.author)
  articles: Article[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @OneToMany(() => UserFollow, follow => follow.follower)
  following: UserFollow[];

  @OneToMany(() => UserFollow, follow => follow.following)
  followers: UserFollow[];

  @OneToMany(() => ArticleFavorite, favorite => favorite.user)
  favorites: ArticleFavorite[];

  // Virtual property for API responses (not stored in DB)
  @Exclude({ toPlainOnly: true })
  isFollowing?: boolean;

  // Hash password before inserting
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Method to check if a password is valid
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Method to generate JWT token payload
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      bio: this.bio || '',
      image: this.image || '',
      following: this.isFollowing || false,
    };
  }
}
