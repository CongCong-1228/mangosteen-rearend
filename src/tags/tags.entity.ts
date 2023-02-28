/* eslint-disable prettier/prettier */
import { Item } from 'src/item/item.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class Tags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: undefined })
  sign: string;

  @Column()
  userId: number;

  @Column({ default: undefined })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  @Column({ default: 0 })
  amount: number;

  @Column()
  type: string;

  @ManyToOne(() => Item, (item) => item.tagIds)
  itemId: number;
}
