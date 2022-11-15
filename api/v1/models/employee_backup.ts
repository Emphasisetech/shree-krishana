import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import role from "../common/constants/role";
import { Department } from "./department";
import { Designation } from "./designation";
import { Employee } from "./employee";

@Entity({ name: 'employee_backup' })
export class EmployeeBackup {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    id_card_number: string;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        default: role.USER
    })
    role: number;

    @Column("text")
    unique_id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    address: string;

    @Column()
    image: string;

    @Column()
    phone_number: number;

    @Column({
        default: false
    })
    is_accepted: boolean;

    @Column({
        default: false
    })
    is_deleted: boolean;

    @ManyToOne(() => Designation, designation => designation.id)
    designation: number;

    @ManyToOne(() => Department, department => department.id)
    department: number;
    
    @ManyToOne(() => Employee, employee => employee.id)
    employee: string;
}