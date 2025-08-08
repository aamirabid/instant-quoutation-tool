import { ScopeType, TimelineType, ProjectType } from "@/config/enums";
import { IsString, IsNumber, IsOptional, IsEnum } from "class-validator";

export class QuoteRequestDTO {
  @IsString()
  public fullAddress: string;

  @IsEnum(ProjectType)
  public projectType: ProjectType;

  @IsNumber()
  public propertySize: number;

  @IsEnum(ScopeType)
  public scopeOfWork: ScopeType;

  @IsEnum(TimelineType)
  public timelineNeeded: TimelineType;

  @IsString()
  public fullName: string;

  @IsString()
  public email: string;

  @IsOptional()
  @IsString()
  public phoneNumber?: string;
}
