import { Entity, Column, PrimaryGeneratedColumn} from "typeorm";


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

}