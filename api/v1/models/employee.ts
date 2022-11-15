import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import role from "../common/constants/role";
import { Department } from "./department";
import { Designation } from "./designation";
import { EmployeeBackup } from "./employee_backup";
import { QuestionAnswer } from "./question_answer";
@Entity({ name: 'employee' })
export class Employee {
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
    phone_number: string;

    @Column({
        default: false
    })
    is_accepted: boolean;

    @Column({
        default: false
    })
    is_deleted: boolean;

    @Column({
        default: false
    })
    is_temporary_password: boolean;

    @ManyToOne(() => Designation, designation => designation.id)
    designation: number;

    @ManyToOne(() => Department, department => department.id)
    department: number;

    @OneToMany(() => EmployeeBackup, employee_backup => employee_backup.employee)
    employee: Employee[];

    @OneToMany(() => QuestionAnswer, question => question.employee)
    question: Employee[];
}