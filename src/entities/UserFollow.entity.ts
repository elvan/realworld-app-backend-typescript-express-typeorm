import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique
} from 'typeorm';
import { User } from './User.entity';

@Entity('user_follows')
@Unique(['follower', 'following'])
export class UserFollow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.following)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User, user => user.followers)
  @JoinColumn({ name: 'following_id' })
  following: User;

  @CreateDateColumn()
  createdAt: Date;
}
