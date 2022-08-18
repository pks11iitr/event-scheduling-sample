import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Event } from './event.entity';
import { EventBreak } from './event-breaks.entity';
import { Holiday } from './holidays.entity';
import { BookingCount } from './booking-count.entity';
import { Booking } from './booking.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Event, Booking, EventBreak, Holiday, BookingCount])] , 
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
