import { Entity, Column, PrimaryGeneratedColumn,  ManyToOne, UpdateDateColumn, DeleteDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Area } from "./area";
import { Employee } from "./employee";
import { Zone } from "./zone";
@Entity({ name: 'material' })
export class Material {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        length: 100
    })
    type: string;

    @Column({
        length: 100
    })
    serial_number: string;

    @Column({
        length: 100
    })
    file: string;

    @Column({
        length: 100
    })
    purpose: string;

    @Column({
        length: 100
    })
    in_date: string;

    @Column({
        length: 100
    })
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

    @Column({
        length: 100
    })
    remarks: string;

    @ManyToOne(() => Zone, zone => zone.id)
    zone: Zone[];

    @ManyToMany(() => Area, area => area.id)
    @JoinTable()
    area_permitted: Area[];

    @ManyToOne(() => Employee, employee => employee.id)
    carry_by: Employee;

    @ManyToOne(() => Employee, employee => employee.id)
    recommend_by: Employee[];

    @ManyToOne(() => Employee, employee => employee.id)
    approved_by: Employee;

    @ManyToOne(() => Employee, employee => employee.id)
    deleted_by: Employee;

    @ManyToOne(() => Employee, employee => employee.id)
    added_by: number;


    @UpdateDateColumn()
    update_date: Date;

    @DeleteDateColumn()
    delete_date: Date;
}