import { Entity, Column, PrimaryGeneratedColumn, Table, OneToMany, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { EventBreak } from "./event-breaks.entity";
import { Holiday } from "./holidays.entity";
import * as date from 'date-and-time';

@Entity('events')
export class Event {

    @PrimaryGeneratedColumn()
    event_id: number;
  
    @Column()
    name: string;
  
    @Column()
    session_duration: number;

    @Column()
    break_duration: number;

    @Column()
    max_bookings: number;

    @Column()
    future_days: number;

    @Column()
    opening_time: string;


    @Column()
    closing_time: string;
  

    //one to many cant exist without many-to-one relation. 
    //But many-to-one can exists without one-to-many
    @OneToMany(()=>EventBreak, (breaks)=> breaks.event, {eager:true})
    breaks:EventBreak[];


    @ManyToMany(()=>Holiday, {eager:true})
    @JoinTable({
        name: "event_holidays", // table name for the junction table of this relation
        joinColumn: {
            name: "event_id",
            referencedColumnName: "event_id"
        },
        inverseJoinColumn: {
            name: "holiday_id",
            referencedColumnName: "holiday_id"
        }
    })
    holidays:Holiday[];


    checkValidDateForEvent(booking_date:string):boolean|string{

        const last_day = date.format(date.addDays(new Date(), this.future_days), 'YYYY-MM-DD').toString();
        
        if(booking_date > last_day)
            return false;

        if(!this.checkPublicHolidaySafe(booking_date))
            return false;

        return true;
    
    }


    checkPublicHolidaySafe(booking_date:string):boolean{
        const holidays = this.holidays;
        for (let index = 0; index < holidays.length; index++) {
            let holiday = holidays[index];
            if(holiday.date == booking_date)
               return false; 
        }
        return true;
    }


    checkValidSlotForEvent(booking_time:string):boolean|string{
        let slot_start_time = this.opening_time;
        const total_time_taken_per_slot = (this.session_duration??0)+(this.break_duration??0);
        
        while(slot_start_time < this.closing_time){

            if(slot_start_time == booking_time && this.checkBreakSafe(booking_time)){
                return true;
            }

            let today = date.format(new Date(), 'YYYY-MM-DD').toString()+' '+slot_start_time;
            slot_start_time = date.format(date.addMinutes(new Date(today), total_time_taken_per_slot), 'HH:mm:ss').toString();
            
        //     date('H:i:s', strtotime('+'.$total_time_taken_per_slot.' minutes', strtotime($slot_start_time)));
        }

        return false; 
    }



    checkBreakSafe(booking_time){
        const breaks = this.breaks;
        let start_time = booking_time;
        // end_time = date('H:i:s', strtotime('+'.($this->session_duration??0).' minutes', strtotime($start_time)));

        let start_date_time = date.format(new Date(), 'YYYY-MM-DD').toString()+' '+start_time;
        let end_time = date.format(date.addMinutes(new Date(start_date_time), this.session_duration), 'HH:mm:ss').toString();


        for (let index = 0; index < breaks.length; index++) {
            let event_break = breaks[index];
            if(end_time <= event_break.break_start_time){
                continue;
            }else if(start_time >= event_break.break_end_time){
                continue;
            }else
                return false;
            
        }
        return true;
    }

}