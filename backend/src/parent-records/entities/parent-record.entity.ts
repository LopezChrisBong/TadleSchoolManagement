import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ParentRecord {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', nullable: false })
  studentID: number;

  @Column({ type: 'int', nullable: false })
  parentID: number;

  @Column({ type: 'int', nullable: false })
  school_yearID: number;

  @CreateDateColumn({
    nullable: false,
    type: 'datetime',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: Date;
}
