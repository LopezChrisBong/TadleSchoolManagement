import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class CreateEnrollStudentDto {

    @ApiProperty()
    @IsNotEmpty()
    fname: string;

    @ApiProperty()
    lname: string;

    @ApiProperty()
    mname: string;

    @ApiProperty()
    suffix: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    bdate: string;

    @ApiProperty()
    birth_place: string;

    @ApiProperty()
    sex: string;

    @ApiProperty()
    civil_status: string;

    @ApiProperty()
    seniorJunior: string;
    
    @ApiProperty()
    transfered: boolean;
    
    @ApiProperty()
    height: string;
    
    @ApiProperty()
    weight: string;
    
    @ApiProperty()
    is_IP: boolean;
    
    @ApiProperty()
    ip_Name: string;
    
    @ApiProperty()
    fourPs: boolean;
    
    @ApiProperty()
    fourpis: string;
    
    @ApiProperty()
    blood_type: string;
    
    @ApiProperty()
    isFilipino: string;
    
    @ApiProperty()
    mobile_no: string;
    
    @ApiProperty()
    residential_zip: string;
    
    @ApiProperty()
    residential_house_no: string;
    
    @ApiProperty()
    residential_street: string;
    
    @ApiProperty()
    residential_subd: string;
    
    @ApiProperty()
    residential_brgy: string;
    
    @ApiProperty()
    residential_city: string;
    
    @ApiProperty()
    residential_prov: string;
    
    @ApiProperty()
    permanent_zip: string;
    
    @ApiProperty()
    permanent_house_no: string;
    
    @ApiProperty()
    permanent_street: string;
    
    @ApiProperty()
    permanent_subd: string;
    
    @ApiProperty()
    permanent_brgy: string;
    
    @ApiProperty()
    permanent_city: string;
    
    @ApiProperty()
    permanent_prov: string;
    
    @ApiProperty()
    isSameAddress: string;
   
    @ApiProperty()
      father_fname: string;
      
      @ApiProperty()
      father_mname: string;
      
      @ApiProperty()
      father_lname: string;
      
      @ApiProperty()
      father_number: string;
      
      @ApiProperty()
      mother_fname: string;
      
      @ApiProperty()
      mother_mname: string;
     
      @ApiProperty()
      mother_lname: string;
      
      @ApiProperty()
      mother_number: string;
      
      @ApiProperty()
      guardian_fname: string;
      
      @ApiProperty()
      guardian_mname: string;
      
      @ApiProperty()
      guardian_lname: string;
      
      @ApiProperty()
      guardian_number: string;

      @ApiProperty()
      last_grade_completed: string;
      
      @ApiProperty()
      last_year_completed: string;
      
      @ApiProperty()
      last_school_attended: string;
      
      @ApiProperty()
      last_school_ID: string;

      @ApiProperty()
      track: string;

      @ApiProperty()
      semester: string;

      @ApiProperty()
      strand: string;

      @ApiProperty()
      disabilty: boolean;

      @ApiProperty()
      disability_dec: string;

      @ApiProperty()
      grade_level:string;

      @ApiProperty()
      statusEnrolled: number;

      @ApiProperty()
      picture: string;
  
        @ApiProperty()
        goodMoral: string;
  
        @ApiProperty()
        birthPSA: string;
  
      @ApiProperty()
      schoolCard: string;


      @ApiProperty()
      school_yearId:string
      
      @ApiProperty()
      lrnNo:string

 
}