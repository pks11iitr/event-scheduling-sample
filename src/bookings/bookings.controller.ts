import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { BookingsService } from './bookings.service';
import {BookEventDto} from './dto/book-event.dto';

@Controller('bookings')
export class BookingsController {

    constructor(private bookingService:BookingsService){

    }

    @Get('view')
    view(@Req() request:Request){
        return this.bookingService.view();
    }


    @Post('book')
    book(@Req() request:Request){
        return this.bookingService.book(request.body);    
    }

}
