import { Users } from 'src/auth/entities/auth.entity';
import { UserType } from 'src/user-type/entities/user-type.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserDetail {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 50,
  })
  fname: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 50,
  })
  mname: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 50,
  })
  lname: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 10,
  })
  suffix: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 10,
  })
  bdate: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 6,
  })
  sex: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 50,
  })
  civil_status: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 100,
  })
  citizenship: string;

  @Column({
    nullable: true,
    type: 'int',
  })
  country: number;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 100,
  })
  tel_no: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 13,
  })
  mobile_no: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  residential_zip: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  residential_house_no: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  residential_street: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  residential_subd: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  residential_brgy: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  residential_city: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  residential_prov: string;

  @Column({
    nullable: true,
    type: 'tinyint',
    default: false,
  })
  isApproved: boolean;

  @Column({
    type: 'int',
    default: 1,
  })
  status: number;

  @Column({
    nullable: true,
    type: 'int',
  })
  userID: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 150,
  })
  profile_img: string;

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
