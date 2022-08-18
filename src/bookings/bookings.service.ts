import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Event } from './event.entity';
import { Booking } from './booking.entity';
import { EventBreak } from './event-breaks.entity';
import {BookEventDto } from './dto/book-event.dto';
import { BookingCount } from './booking-count.entity';
import * as date from 'date-and-time';

@Injectable()
export class BookingsService {

    constructor(@InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(Booking) private bookingRepository:Repository<Booking>,
    @InjectRepository(BookingCount) private bookingCountRepository:Repository<BookingCount>){

    }

    async view(){
       const occupied  = await this.getBookingStatus()
       const events = await this.eventRepository.find()
       
       return {
        occupied:occupied,
        events:events
       }
       
       //const occupied = await
    }


    async book(data:BookEventDto){
        const event = await this.eventRepository.findOneBy({event_id:data.event_id});
        
        if (!event)
            return "Event cannot be booked";
         
        // Q: find out how to check null
        let validate_data = this.validateBookingData(event, data); 
        if(validate_data!==true)
            return validate_data;   

        //write code to add bookings here. only put into repository no need for any checks
        const booking = await this.create_booking(event, data);
        return booking;

    }


    validateBookingData(event:Event, data:BookEventDto){
        const booking_date = data.booking_date;
        const booking_time = data.booking_time; 

        const current_time = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss').toString();
        if(current_time > (booking_date+' '+booking_time)){
            return 'Invalid date slot selected';
        }

        let res = event.checkValidDateForEvent(booking_date)
        if(res !==true)
            return 'Booking cannot be done for this date';

        res = event.checkValidSlotForEvent(booking_time)
        if(res !==true)
            return 'Selected slot is not available for booking. Please select different slot'; 
        
        return true;
    }


    async create_booking(event:Event, data:BookEventDto):Promise<Booking|String>{
        const start_date_time = data.booking_date+' '+ data.booking_time;
        let booking_end = date.format(date.addMinutes(new Date(start_date_time), event.session_duration), 'HH:mm:ss');

        console.log(start_date_time)

        let booking_count = await this.bookingCountRepository.findOneBy({
            event_id:data.event_id,
            date_time:start_date_time
        }); 
        
        if(!booking_count){
            this.bookingCountRepository.save({
                event_id:data.event_id,
                count:1,
                date_time:start_date_time
            })    
        }else if(booking_count.count < event.max_bookings){
            this.bookingCountRepository.update({event_id:data.event_id, date_time:start_date_time}, {count:booking_count.count+1})
        }else{
            return 'already_booked';
        }
             
        const booking = await this.bookingRepository.save({
            'event_id' : data.event_id,
            'booking_date' : data.booking_date,
            'booking_start_time' : data.booking_time,
            'booking_end_time' : booking_end,
            'customer_email' : data.email,
            'customer_first_name' : data.first_name,
            'customer_last_name' : data.last_name,
            'booked_on' : date.format(new Date(), 'YYYY-MM-DD').toString()
        });
        return booking;   
    }


    async getBookingStatus():Promise<Event[]>{
        const today_date = date.format(new Date(), 'YYYY-MM-DD').toString()+' '+'00:00:00';
        
        const occupied = await this.eventRepository.find({
          relations:{
              booking_count:true
          },
          where:{
              booking_count:{
                  date_time:MoreThanOrEqual(today_date)
              }
          },
          select:{
              event_id:true,
              booking_count:{
                date_time:true,
                count:true
              },
              max_bookings:true
          }
        });

        return occupied
  }


    

}
