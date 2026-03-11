import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private studentsRepository: Repository<Student>,
    ) { }

    async create(createStudentDto: CreateStudentDto): Promise<{ success: boolean; data: Student }> {
        try {
            const student = this.studentsRepository.create(createStudentDto);
            const savedStudent = await this.studentsRepository.save(student);
            return { success: true, data: savedStudent };
        } catch (error) {
            if (error.code === '23505') { // Postgres unique violation
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }

    async findAll(): Promise<{ success: boolean; count: number; data: Student[] }> {
        const students = await this.studentsRepository.find({
            order: { name: 'ASC' }
        });
        return { success: true, count: students.length, data: students };
    }

    async findOne(id: string): Promise<{ success: boolean; data: Student }> {
        const student = await this.studentsRepository.findOneBy({ id });
        if (!student) {
            throw new NotFoundException(`Student #${id} not found`);
        }
        return { success: true, data: student };
    }

    async update(id: string, updateStudentDto: UpdateStudentDto): Promise<{ success: boolean; data: Student }> {
        try {
            const student = await this.studentsRepository.preload({
                id,
                ...updateStudentDto,
            });

            if (!student) {
                throw new NotFoundException(`Student #${id} not found`);
            }

            const updatedStudent = await this.studentsRepository.save(student);
            return { success: true, data: updatedStudent };
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }

    async remove(id: string): Promise<{ success: boolean; message: string }> {
        const student = await this.studentsRepository.findOneBy({ id });
        if (!student) {
            throw new NotFoundException(`Student #${id} not found`);
        }

        await this.studentsRepository.remove(student);
        return { success: true, message: 'Student successfully deleted' };
    }
}
