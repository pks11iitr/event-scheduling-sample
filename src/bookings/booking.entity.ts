import { getDataSourceName, InjectRepository } from "@nestjs/typeorm";
import { Entity, Column, PrimaryGeneratedColumn, Repository, MoreThanOrEqual, ManyToOne, JoinColumn} from "typeorm";
import { Event } from "./event.entity";


@Entity('bookings')
export class Booking {

    @PrimaryGeneratedColumn()
    booking_id: number;
  
    @Column()
    event_id: number;

    @Column()
    booking_start_time: string;

    @Column()
    booking_end_time: string;

    @Column()
    booking_date: string;

    @Column()
    booked_on: string;

    @Column()
    customer_email: string;

    @Column()
    customer_first_name: string;

    @Column()
    customer_last_name: string;

    @ManyToOne(()=>Event, (event)=>event.bookings)
    @JoinColumn({name:'event_id', referencedColumnName:'event_id'})
    event:Event;

}