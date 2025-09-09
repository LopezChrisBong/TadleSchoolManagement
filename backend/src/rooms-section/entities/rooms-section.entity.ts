
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
export class RoomsSection {

    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @Column(
      {  
        type:'varchar',
        nullable:false
      }
    )
    room_section:string

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
          nullable:true,
          default:null
        }
      )
      strandId:number

      @Column(
        {  
          type:'int',
          nullable:true,
          default:null
        }
      )
      teacherId:number

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
