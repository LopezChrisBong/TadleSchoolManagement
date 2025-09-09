
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
export class StudentAttendance {

    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @Column(
      {  
        type:'int',
        nullable:false
      }
    )
    roomID:number


    @Column(
        {  
          type:'int',
          nullable:false
        }
      )
      school_yearID:number

    @Column(
        {  
          type:'int',
          nullable:false
        }
      )
      teacherID:number


      @Column(
        {  
          type:'int',
          default:false
        }
      )
      attendance:number

       @Column(
        {  
          type:'int',
          nullable:false
        }
      )
      studentID:number

       @Column(
        {  
          type:'int',
          nullable:false
        }
      )
      subjectID:number

      @Column(
        {  
          type:'varchar',
          nullable:false
        }
      )
      attendanceDate:string



      
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
