import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class StudentValues {

    @PrimaryGeneratedColumn({ type: 'int' })
    id: number
    
    @Column({ type: "int" })
    studentId: number

    @Column({ type: "int" })
    roomId: number

    @Column({ type: "varchar" })
    quarter: string

    @Column({ type: "varchar" })
    semester: string

    @Column({ type: "int" })
    school_yearId: number

    @Column({ type: "varchar" })
    md1_values: string

    @Column({ type: "varchar" })
    md2_values: string

    @Column({ type: "varchar" })
    mt1_values: string

    @Column({ type: "varchar" })
    mt2_values: string

    @Column({ type: "varchar" })
    mk1_values: string

    @Column({ type: "varchar" })
    mb1_values: string

    @Column({ type: "varchar" })
    mb2_values: string

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
