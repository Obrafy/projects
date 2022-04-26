import { Type } from 'class-transformer';
import { IsDateString, IsString, IsNotEmpty, ValidateNested } from 'class-validator'

class Address {
    @IsString()
    zipCode: string;
    @IsString()
    street: string;
    @IsString()
    number: string;
    @IsString()
    neighborhood: string;
    @IsString()
    city: string;
    @IsString()
    state: string;
}


class Tasks {
    @IsNotEmpty()
    category: string;

    @IsNotEmpty()
    activity: string;

    @IsString()
    noiseLevel: string;

    @IsString()
    messLevel: string;
}

export class CreateProjectDto {

    id: string;
    status: string;

    @IsNotEmpty()
    startDate: Date;

    endDate: Date;

    @IsDateString()
    @IsNotEmpty()
    expectedFinishedDate

    @IsString()
    responsible: string;

    @IsNotEmpty()
    @Type(() => Address)
    @ValidateNested()
    address: Address

    @IsNotEmpty()
    @Type(() => Tasks)
    @ValidateNested()
    tasks: Tasks[]

}
