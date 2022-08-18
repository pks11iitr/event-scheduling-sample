import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    BookingsModule,
    TypeOrmModule.forRoot({
      type :"sqlite",
      database: "bookings",
      //entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
      autoLoadEntities:true
    })
  ]
})
export class AppModule {}
