import { CursorPaginationDto } from '../../../common/pagination/pagination.dto';

// Hereda cursor/limit — el feed no tiene filtros propios todavía
// (se agregan si el producto lo pide, ej. "solo BUILD en mi feed").
export class FeedQueryDto extends CursorPaginationDto {}
