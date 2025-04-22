import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  Index
} from 'typeorm';
import { User } from './User.entity';
import { Comment } from './Comment.entity';
import { Tag } from './Tag.entity';
import { ArticleFavorite } from './ArticleFavorite.entity';
import slugify from 'slugify';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  @Index({ unique: true })
  slug: string;

  @Column()
  description: string;

  @Column('text')
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.articles, { eager: true })
  author: User;

  @OneToMany(() => Comment, comment => comment.article)
  comments: Comment[];

  @ManyToMany(() => Tag, tag => tag.articles)
  @JoinTable({ 
    name: 'article_tags', 
    joinColumn: { name: 'article_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: Tag[];

  @OneToMany(() => ArticleFavorite, favorite => favorite.article)
  favorites: ArticleFavorite[];

  // To store the tag list as simple strings in the API response
  tagList: string[];

  // Additional property to indicate if an article is favorited by current user
  favorited: boolean = false;

  // Count of favorites
  favoritesCount: number = 0;

  // Generate slug before inserting
  @BeforeInsert()
  generateSlug() {
    if (this.title) {
      // Generate a slug from the title + timestamp to ensure uniqueness
      const timestamp = new Date().getTime().toString(36);
      this.slug = slugify(this.title, { lower: true }) + '-' + timestamp;
    }
  }

  // Prepare article for API response format
  toJSON(currentUser?: User) {
    // Convert tags to string array for the API
    this.tagList = this.tags ? this.tags.map(tag => tag.name) : [];
    
    // Set favorited status based on current user
    if (currentUser && this.favorites) {
      this.favorited = this.favorites.some(fav => fav.user.id === currentUser.id);
    } else {
      this.favorited = false;
    }
    
    // Set favorites count
    this.favoritesCount = this.favorites ? this.favorites.length : 0;
    
    return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      body: this.body,
      tagList: this.tagList,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      favorited: this.favorited,
      favoritesCount: this.favoritesCount,
      author: {
        username: this.author.username,
        bio: this.author.bio,
        image: this.author.image,
        following: false // This will be set by the service layer
      }
    };
  }
}
