
import { Expose, Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class addVisitor {
    @Expose()
    @IsDefined()
    @IsString()
    name: string;

    @Expose()
    @IsDefined()
    @IsString()
    organization: string;

    @Expose()
    @IsDefined()
    @IsNumber()
    @Type(() => Number)
    id_proof_type: number;

    @Expose()
    @IsDefined()
    @IsString()
    id_proof_number: string;

    @Expose()
    @IsDefined()
    @IsNotEmpty()
    designation: string;

    @Expose()
    @IsDefined()
    @IsNotEmpty()
    purpose: string;

    @Expose()
    @IsDefined()
    @IsNotEmpty()
    in_date: string;

    @Expose()
    @IsDefined()
    @IsNotEmpty()
    out_date: string;

    @Expose()
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    remarks: string;

    @Expose()
    @IsDefined()
    @IsNumber()
    @Type(() => Number)
    person_to_meet: number;

    @Expose()
    @IsDefined()
    @IsNumber()
    @Type(() => Number)
    zone: number;

    @Expose()
    @IsDefined()
    @IsString()
    image: string;

    @Expose()
    @IsDefined()
    @IsArray()
    @IsNumber({ allowNaN: false, }, { each: true })
    @Type(() => Number)
    area_permitted: number[];
}

export class updateVisitor {
    @Expose()
    @IsDefined()
    @IsString()
    name?: string;

    @Expose()
    @IsDefined()
    @IsString()
    organization?: string;

    @Expose()
    @IsDefined()
    @IsNumber()
    @Type(() => Number)
    id_proof_type?: number;

    @Expose()
    @IsDefined()
    @IsString()
    id_proof_number?: string;

    @Expose()
    @IsDefined()
    @IsNotEmpty()
    designation?: string;

    @Expose()
    @IsDefined()
    @IsNotEmpty()
    purpose?: string;

    @Expose()
    @IsDefined()
    @IsNotEmpty()
    in_date?: string;


    @Expose()
    @IsDefined()
    @IsNotEmpty()
    out_date?: string;

    @Expose()
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    remarks?: string;


    @Expose()
    @IsDefined()
    @IsNumber()
    @Type(() => Number)
    person_to_meet?: number;

    @Expose()
    @IsDefined()
    @IsNumber()
    @Type(() => Number)
    zone: number;

    @Expose()
    @IsDefined()
    @IsArray()
    @IsNumber({ allowNaN: false, }, { each: true })
    @Type(() => Number)
    area_permitted?: number[];
}
