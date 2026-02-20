import { Exclude } from 'class-transformer';
import { UserDetail } from 'src/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StudentGrade {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  roomID: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  school_yearID: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  sub_subject: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  studentID: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  subjectID: number;

  @Column({
    type: 'int',
    default: false,
  })
  quarterScore: number;

  @Column({
    type: 'int',
    default: false,
  })
  highest_posible_score: number;

  @Column({
    type: 'int',
    default: false,
  })
  type: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  quarter: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  semester: string;

  @Column({
    type: 'longtext',
    nullable: false,
  })
  title: string;

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
