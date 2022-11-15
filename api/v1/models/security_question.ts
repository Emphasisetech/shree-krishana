import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity({ name: 'security_question' })
export class SecurityQuestion {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        length: 100
    })
    statement: string;

    @Column({
        default: false
    })
    is_deleted: boolean;
}