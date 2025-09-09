
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StudentReportDisciplinary {

    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @Column( { type:'int', nullable:false })
    studentID:number

    @Column( { type:'int',nullable:false})
    teacherID:number

    @Column( { type:'int',nullable:false})
    roomID:number

    @Column( { type:'int',nullable:false})
    report_type:number

    @Column( { type:'varchar',nullable:false})
    report_description:string

    @Column( { type:'varchar',nullable:false})
    grade_level:string

    @Column( { type:'int',nullable:false})
    school_yearID:number

    @Column( { type:'int',nullable:false})
    subjectID:number

     @Column( { type:'int',default:false})
    status:number

      
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

