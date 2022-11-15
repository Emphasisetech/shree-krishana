import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Employee } from "./employee";
import { SecurityQuestion } from "./security_question";
@Entity({ name: 'question_answer' })
export class QuestionAnswer {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        default: false
    })
    answer: string;

    @ManyToOne(() => SecurityQuestion, question => question.id)
    question: number;

    @ManyToOne(() => Employee, employee => employee.id)
    employee: number;

}