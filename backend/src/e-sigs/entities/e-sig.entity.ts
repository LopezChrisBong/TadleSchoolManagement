import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ESig {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', nullable: false })
  user_detailID: number;

  @Column({ type: 'varchar', nullable: false })
  esign_filename: string;

  @Column({ type: 'blob', nullable: true })
  esign: string;
}
