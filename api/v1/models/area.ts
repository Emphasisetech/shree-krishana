import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Zone } from "./zone";
@Entity({ name: 'area' })
export class Area {
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

    @ManyToOne(() => Zone, zone => zone.id)
    zone: number;
}