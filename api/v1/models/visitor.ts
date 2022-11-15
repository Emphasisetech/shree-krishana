import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, DeleteDateColumn, JoinTable, ManyToMany } from "typeorm";
import { Area } from "./area";
import { Employee } from "./employee";
import { IdProofType } from "./idProofType";
import { Zone } from "./zone";
@Entity({ name: 'visitor' })
export class Visitor {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    name: string;

    @Column()
    organization: string;

    @Column()
    id_proof_number: string;


    @Column()
    purpose: string;

    @Column()
    image: string;

    @Column()
    id_proof_file: string;
    
    @Column()
    in_date: string;

    @Column()
    out_date: string;

    @Column({
        default: false
    })
    is_recommend: boolean;

    @Column({
        default: false
    })
    is_approved: boolean;

    @Column({
        default: false
    })
    is_deleted: boolean;

    @Column()
    designation: string;

    @Column()
    remarks: string;

    @ManyToOne(() => Zone, zone => zone.id)
    zone: Zone[];

    @ManyToMany(() => Area, area => area.id)
    @JoinTable()
    area_permitted: Area[];
    

    @ManyToOne(() => Employee, employee => employee.id)
    person_to_meet: Employee;

    @ManyToOne(() => Employee, employee => employee.id)
    approved_by: Employee;

    @ManyToOne(() => Employee, employee => employee.id)
    recommend_by: Employee[];

    @ManyToOne(() => Employee, employee => employee.id)
    added_by: number;

    @ManyToOne(() => IdProofType, id_proof_type => id_proof_type.id)
    id_proof_type: IdProofType;

    @ManyToOne(() => Employee, employee => employee.id)
    deleted_by: Employee;

    @UpdateDateColumn()
    update_date: Date;

    @DeleteDateColumn()
    delete_date: Date;
}