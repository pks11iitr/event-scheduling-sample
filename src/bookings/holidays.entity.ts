import { Entity, Column, PrimaryGeneratedColumn, Table, ManyToMany, JoinTable } from "typeorm";
import { Event } from "./event.entity";


@Entity('public_holidays')
export class Holiday {

    @PrimaryGeneratedColumn()
    holiday_id: number;
  
    @Column()
    date: string;

    @Column()
    holiday_name: string;

    @ManyToMany(()=>Event)
    @JoinTable({
        name: "event_holidays", // table name for the junction table of this relation
        joinColumn: {
            name: "holiday_id",
            referencedColumnName: "holiday_id"
        },
        inverseJoinColumn: {
            name: "event_id",
            referencedColumnName: "event_id"
        }
    })
    events:Event[];


}