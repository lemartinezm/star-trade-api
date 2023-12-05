import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfileImagesService } from './profile-images.service';
import { CreateProfileImageDto } from './dto/create-profile-image.dto';
import { UpdateProfileImageDto } from './dto/update-profile-image.dto';

@Controller('profile-images')
export class ProfileImagesController {
  constructor(private readonly profileImagesService: ProfileImagesService) {}

  @Post()
  create(@Body() createProfileImageDto: CreateProfileImageDto) {
    return this.profileImagesService.create(createProfileImageDto);
  }

  @Get()
  findAll() {
    return this.profileImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileImageDto: UpdateProfileImageDto) {
    return this.profileImagesService.update(+id, updateProfileImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileImagesService.remove(+id);
  }
}
