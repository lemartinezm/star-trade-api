import { Module } from '@nestjs/common';
import { ProfileImagesService } from './profile-images.service';
import { ProfileImagesController } from './profile-images.controller';

@Module({
  controllers: [ProfileImagesController],
  providers: [ProfileImagesService],
})
export class ProfileImagesModule {}
