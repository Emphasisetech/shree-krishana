import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Area } from "./area";
import { Visitor } from "./visitor";
@Entity({ name: 'zone' })
export class Zone {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        length: 100
    })
    color: string;

    @Column()
    priority: number;

    @Column({
        default: false
    })
    is_deleted: boolean;

    @OneToMany(() => Area, area => area.zone)
    area: Area[];

    @OneToMany(() => Visitor, visitor => visitor.zone)
    visitor: Visitor[];
}