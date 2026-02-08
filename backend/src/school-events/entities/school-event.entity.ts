import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SchoolEvent {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  eventName: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  eventDate: string;

  @Column({ type: 'text', nullable: false })
  eventDescription: string;

  @Column({ type: 'text', nullable: false })
  eventType: string;

  @Column({ type: 'text', nullable: true })
  eventFile: string;

  @Column({ type: 'int', nullable: false })
  addedBy: number;

  @Column({ type: 'int', nullable: false })
  schoolYearID: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

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
