import { IsInt, Min, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsBoolean()
  hidden?: boolean;

  @IsInt()
  itemId: number;
}
