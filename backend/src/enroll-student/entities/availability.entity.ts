import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Availability {

    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @Column({ type: "int" })
    teacherID: number

    @Column({ type: "int" })
    subjectId: number

    @Column({ type: "int" })
    roomId: number

    @Column({ type: "varchar" })
    day: string

    @Column({ type: "varchar" })
    grade_level: string

    @Column({ type: "varchar" })
    times_slot_from: string

    @Column({ type: "varchar" })
    times_slot_to: string

    @Column({ type: "varchar" })
    hours: string

    @Column({ type: "int" })
    school_yearId: number


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
