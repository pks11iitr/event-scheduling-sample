import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { Event } from "./event.entity";

@Entity('booking_count')
export class BookingCount {

    @PrimaryGeneratedColumn()
    count_id: number;
  
    @Column()
    event_id: number;

    @Column()
    date_time: string;

    @Column()
    count: number;

    @ManyToOne(()=>Event, (event)=>'event.booking_count')
    @JoinColumn({name:'event_id'})
    event:Event





}