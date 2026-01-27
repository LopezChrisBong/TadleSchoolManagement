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
export class EnrollStudent {
    @PrimaryGeneratedColumn({
        type: 'bigint',
      })
      id: number;

      @Column({
        nullable: true,
        type: 'varchar',
      })
        fname: string;

        @Column({
            nullable: true,
            type: 'varchar',
          })
        lname: string;

        @Column({
            nullable: true,
            type: 'varchar',
          })
        mname: string;

        @Column({
            nullable: true,
            type: 'varchar',
          })
        suffix: string;


        @Column({
            nullable: true,
            type: 'varchar',
          })
        lrnNo: string;

        @Column({
            nullable: true,
            type: 'varchar',
          })
        email: string;
          
        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
        })
        bdate: string;



        @Column({
            nullable: true,
            type: 'varchar',
          })
        birth_place: string;

        
        @Column({
          nullable: true,
          type: 'varchar',
        })
        sex: string;

        
  @Column({
    nullable: true,
    type: 'varchar',
    length: 255,
  })
        civil_status: string;

        
  @Column({
    nullable: true,
    type: 'varchar',
    length: 255,
  })
        seniorJunior: string;

        
        @Column({
            type: 'tinyint',
            default: false,
          })
        transfered: boolean;

        @Column({
            nullable: true,
           type: 'varchar',
          length: 255,
          })
        height: string;

          @Column({
            nullable: true,
           type: 'varchar',
          length: 255,
          })
        weight: string;

        @Column({
            type: 'tinyint',
            default: false,
          })
        is_IP: boolean;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        ip_Name: string;

        @Column({
          nullable: true,
          type: 'varchar',
          length: 255,
        })
        track: string;

      @Column({
        nullable: true,
        type: 'varchar',
        length: 255,
      })
      semester: string;

    @Column({
      nullable: true,
      type: 'varchar',
      length: 255,
    })
      strand: string;
      

        @Column({
            type: 'tinyint',
            default: false,
          })
        fourPs: boolean;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        fourpis: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        blood_type: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          isFilipino: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255
          })
        mobile_no: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        residential_zip: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        residential_house_no: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        residential_street: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        residential_subd: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        residential_brgy: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        residential_city: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        residential_prov: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        permanent_zip: string;


        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        permanent_house_no: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        permanent_street: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        permanent_subd: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        permanent_brgy: string

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        permanent_city: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
        permanent_prov: string;

        @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          father_fname: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          father_mname: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          father_lname: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          father_number: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          mother_fname: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          mother_mname: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          mother_lname: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          mother_number: string;


          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          guardian_fname: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          guardian_mname: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          guardian_lname: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          guardian_number: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          last_grade_completed: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          last_year_completed: string;


          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          last_school_attended: string;

          @Column({
            nullable: true,
            type: 'varchar',
            length: 255,
          })
          last_school_ID: string;

          @Column({
            type: 'tinyint',
            default:false,
          })
        disability: boolean;

        @Column({
          nullable: true,
          type: 'varchar',
          length: 255,
        })
      disability_desc: string;

      @Column({
        nullable: true,
        type: 'varchar',
        length: 255,
      })
    grade_level: string;

      @Column({
        type: 'varchar',nullable: true
      })
      picture: string;

      @Column({
        type: 'varchar',nullable: true
      })
      goodMoral: string;

      @Column({
        type: 'varchar',nullable: true
      })
      birthPSA: string;

      @Column({
        type: 'varchar',nullable: true
      })
    schoolCard: string;


        @Column({
          type: 'varchar',nullable: true
        })
        school_yearId: string;

          @Column({
            type: 'tinyint',
            default:0,
          })
        statusEnrolled: number;

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