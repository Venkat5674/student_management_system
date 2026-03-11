"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("./entities/student.entity");
let StudentsService = class StudentsService {
    studentsRepository;
    constructor(studentsRepository) {
        this.studentsRepository = studentsRepository;
    }
    async create(createStudentDto) {
        try {
            const student = this.studentsRepository.create(createStudentDto);
            const savedStudent = await this.studentsRepository.save(student);
            return { success: true, data: savedStudent };
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('Email already exists');
            }
            throw error;
        }
    }
    async findAll() {
        const students = await this.studentsRepository.find({
            order: { name: 'ASC' }
        });
        return { success: true, count: students.length, data: students };
    }
    async findOne(id) {
        const student = await this.studentsRepository.findOneBy({ id });
        if (!student) {
            throw new common_1.NotFoundException(`Student #${id} not found`);
        }
        return { success: true, data: student };
    }
    async update(id, updateStudentDto) {
        try {
            const student = await this.studentsRepository.preload({
                id,
                ...updateStudentDto,
            });
            if (!student) {
                throw new common_1.NotFoundException(`Student #${id} not found`);
            }
            const updatedStudent = await this.studentsRepository.save(student);
            return { success: true, data: updatedStudent };
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('Email already exists');
            }
            throw error;
        }
    }
    async remove(id) {
        const student = await this.studentsRepository.findOneBy({ id });
        if (!student) {
            throw new common_1.NotFoundException(`Student #${id} not found`);
        }
        await this.studentsRepository.remove(student);
        return { success: true, message: 'Student successfully deleted' };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StudentsService);
//# sourceMappingURL=students.service.js.map