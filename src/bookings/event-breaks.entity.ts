import { Entity, Column, PrimaryGeneratedColumn, Table, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity('break_timings')
export class EventBreak {

    @PrimaryGeneratedColumn()
    break_id: number;
  
    @Column()
    title: string;

    @Column()
    break_start_time: string;

    @Column()
    break_end_time: string;

    @Column()
    event_id: number;

    @ManyToOne(()=>Event, (event)=>event.breaks)
    @JoinColumn({name:"event_id"})
    event: Event;

}