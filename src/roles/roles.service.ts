import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(createRoleDto: CreateRoleDto) {
    const count = await this.roleModel.count();
    const role = await this.roleModel.create({
      ...createRoleDto,
      order: count + 1,
    });

    return { role };
  }

  async findAll() {
    return await this.roleModel.find({}).sort('order');
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) return new NotFoundException('Rol no encontrado');

    return { role };
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  async remove(id: string) {
    const roleDeleted = await this.roleModel.findByIdAndDelete(id);
    if (!roleDeleted) return new NotFoundException('Rol no encontrado');

    // Update the order of rest roles
    await this.roleModel.updateMany(
      { order: { $gt: roleDeleted.order } },
      { $inc: { order: -1 } }
    );

    return { ok: true, role: roleDeleted };
  }
}