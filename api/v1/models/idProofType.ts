import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Visitor } from "./visitor";
@Entity({ name: 'id_proof_type' })
export class IdProofType {
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

    @OneToMany(() => Visitor, visitor => visitor.id_proof_type)
    visitor: Visitor[];
}