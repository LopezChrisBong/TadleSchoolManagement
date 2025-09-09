
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StudentQuarterFinalGrade {

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
      studentID:number

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
          nullable:false
        }
      )
      subjectID:number


    @Column(
        {  
          type:'varchar',
          default:false
        }
      )
      initial_grade:string

    @Column(
        {  
          type:'int',
          default:false
        }
      )
      transmuted_grade:number

       @Column(
        {  
          type:'longtext',
          nullable:true
        }
      )
      sub_subject:string

      
    @Column(
        {  
          type:'varchar',
          default:false
        }
      )
      studentLRN:string


    @Column(
        { 
          type:'varchar',
          nullable:false
        }
      )
      quarter:string

       @Column(
        { 
          type:'varchar',
          nullable:false
        }
      )
      semester:string


      
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
