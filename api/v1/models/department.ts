import { Entity, Column, PrimaryGeneratedColumn,  OneToMany } from "typeorm";
import { Employee } from "./employee";
import { EmployeeBackup } from "./employee_backup";
@Entity({ name: 'department' })
export class Department {
    @PrimaryGeneratedColumn()
    public id: number;    
    
    @Column({
        length: 100
    })
    name: string;    
    
    @Column({
        default: false
    })
    is_deleted: boolean;
    
    @OneToMany(() => Employee, employee => employee.department)
    employee: Employee[];

    @OneToMany(() => EmployeeBackup, employee => employee.designation)
    employee_backup: EmployeeBackup[];
}