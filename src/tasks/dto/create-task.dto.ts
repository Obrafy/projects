import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested, IsArray, IsNumber } from 'class-validator'
class PossibleSkills {

    @IsNotEmpty()
    skillId: string; // pintura

    @IsNotEmpty()
    @IsNumber()
    requiredSkillLevel: number; // 2*, 5*;
}

export class CreateTaskDto {

    @IsNotEmpty()
    category: string;

    @IsNotEmpty()
    activity: string;

    @IsString()
    noiseLevel: string;

    @IsString()
    messLevel: string;

    @IsArray()
    @IsNotEmpty()
    @Type(() => PossibleSkills)
    @ValidateNested()
    possibleSkills: PossibleSkills[];
}