import { CursorPaginationDto } from '../../../common/pagination/pagination.dto';

// El cursor acá es el `postId` del último guardado de la página anterior.
export class FindSavesQueryDto extends CursorPaginationDto {}
