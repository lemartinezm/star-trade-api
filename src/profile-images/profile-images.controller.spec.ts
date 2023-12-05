import { Test, TestingModule } from '@nestjs/testing';
import { ProfileImagesController } from './profile-images.controller';
import { ProfileImagesService } from './profile-images.service';

describe('ProfileImagesController', () => {
  let controller: ProfileImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileImagesController],
      providers: [ProfileImagesService],
    }).compile();

    controller = module.get<ProfileImagesController>(ProfileImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
