import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LardoStudentNotification {

    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @Column( { type:'int', nullable:false })
    studentID:number

   @Column( { type:'varchar', nullable:false })
    student_name:string


    @Column( { type:'int',nullable:false})
    teacherID:number


    @Column( { type:'int',nullable:false})
    school_yearID:number

     @Column( { type:'varchar',nullable:false})
    route:string

    @Column( { type:'varchar',nullable:false})
    grade_level:string

    
    @Column( { type:'varchar',nullable:false})
    room_name:string
    

    @Column( { type:'boolean',default:false})
    read:boolean

    @Column( { type:'varchar',nullable:false})
    remarks:string

    @Column( { type:'varchar',nullable:false})
    subject_title:string

      
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


