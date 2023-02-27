import { OneToMany } from 'typeorm';
/* eslint-disable prettier/prettier */
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';
import { Tags } from 'src/tags/tags.entity';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: null })
  userId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  // @ManyToOne(() => User, (user) => user.items)
  // userInfo: User;

  @OneToMany(() => Tags, (tag) => tag.itemId)
  tagIds: Tags[];
}
