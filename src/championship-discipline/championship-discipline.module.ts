import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Championships_DisciplinesController } from "./championship-discipline.controller";
import { Championships_DisciplinesRepository } from "./championship-discipline.repository";
import { Championship_Discipline } from "./championship-discipline.entity";
import { Championships_DisciplinesService } from "./championship-discipline.service";
import { JwtService } from "@nestjs/jwt";


@Module({
  controllers: [Championships_DisciplinesController],
  providers: [Championships_DisciplinesService, Championships_DisciplinesRepository, JwtService],
  imports: [
    TypeOrmModule.forFeature([Championship_Discipline]),
  ],
  exports: [
    Championships_DisciplinesService,
    Championships_DisciplinesRepository,
  ]
})
export class Championships_DisciplinesModule {}