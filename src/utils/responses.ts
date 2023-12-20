import { ApiProperty } from '@nestjs/swagger';

export class MetaData {
  @ApiProperty({ description: 'Current page', example: 1, default: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Items per page', example: 10, default: 10 })
  itemsPerPage: number;

  @ApiProperty({ description: 'Total items', example: 20 })
  totalItems: number;

  @ApiProperty({ description: 'Total pages', example: 2 })
  totalPages: number;

  @ApiProperty({ description: 'Has next page', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Has previous page', example: false })
  hasPreviousPage: boolean;

  @ApiProperty({ description: 'Next page', example: 2, nullable: true })
  nextPage: number | null;

  @ApiProperty({ description: 'Previous page', example: null, nullable: true })
  previousPage: number | null;
}

export class PaginatedResponse {
  @ApiProperty({ description: 'Items array', type: [Object] })
  items: any[];

  @ApiProperty({
    description: 'Pagination info',
    type: MetaData,
  })
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };

  constructor(
    items: any[],
    currentPage: number,
    itemsPerPage: number,
    totalItems: number,
  ) {
    this.items = items;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    this.meta = {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage: hasNextPage ? currentPage + 1 : null,
      previousPage: hasPreviousPage ? currentPage - 1 : null,
    };
  }
}
