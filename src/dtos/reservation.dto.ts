import { IsNotEmpty, IsDateString, IsNumber, Min } from "class-validator"

export class CreateReservationDto {
  @IsNotEmpty()
  vehicleId: string

  @IsNotEmpty()
  agencyId: string

  @IsDateString()
  startDate: string

  @IsNumber()
  @Min(1)
  duration: number
}
