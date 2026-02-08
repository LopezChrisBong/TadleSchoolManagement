import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  subject_title: string;

  @Column({ type: 'varchar' })
  semester: string;

  @Column({ type: 'varchar' })
  senior_level: string;

  @Column({ type: 'varchar', nullable: true })
  indicator: string;

  @Column({ type: 'longtext', nullable: true })
  sub_subject: string;

  @Column({ type: 'varchar' })
  grade_level: string;

  @Column({ type: 'int' })
  writen_works: number;

  @Column({ type: 'int' })
  performance_task: number;

  @Column({ type: 'int' })
  quarter_assessment: number;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'int', default: 0 })
  isSpecialized: number;

  @Column({ type: 'int', nullable: true })
  strandID: number;

  @Column({ type: 'boolean', default: false })
  isDelete: boolean;

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
