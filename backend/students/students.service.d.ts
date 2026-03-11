import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
export declare class StudentsService {
    private studentsRepository;
    constructor(studentsRepository: Repository<Student>);
    create(createStudentDto: CreateStudentDto): Promise<{
        success: boolean;
        data: Student;
    }>;
    findAll(): Promise<{
        success: boolean;
        count: number;
        data: Student[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: Student;
    }>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<{
        success: boolean;
        data: Student;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
