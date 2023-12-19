import { ApiProperty } from '@nestjs/swagger';

export class ApiException {
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Errors description',
    example: ['Error 1', 'Error 2'],
  })
  message: string | string[];

  @ApiProperty({ description: 'Status code message', example: 'Bad Request' })
  error: string;

  @ApiProperty({ description: 'Status code', example: 400 })
  statusCode: number;
}
