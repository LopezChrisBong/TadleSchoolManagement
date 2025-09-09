
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
export class StudentList {

    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @Column(
      {  
        type:'int',
        nullable:false
      }
    )
    studentId:number

    @Column(
        {  
          type:'int',
          nullable:false
        }
      )
      roomId:number

      @Column(
        {  
          type:'varchar',
          nullable:false
        }
      )
      grade_level:string

      @Column(
        {  
          type:'int',
          nullable:false
        }
      )
      school_yearId:number


      @Column(
        {  
          type:'int',
          nullable:true
        }
      )
      strandId:number


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
