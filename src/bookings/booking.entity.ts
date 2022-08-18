import { getDataSourceName, InjectRepository } from "@nestjs/typeorm";
import { Entity, Column, PrimaryGeneratedColumn, Repository, DataSource} from "typeorm";
import { Event } from "./event.entity";


@Entity('bookings')
export class Booking {

    constructor(@InjectRepository(Event) private eventRepository:Repository<Event>){}

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


    // async getBookingStatus(){
    //       const occupied = await this.eventRepository.createQueryBuilder('events').jo 
    // }

}