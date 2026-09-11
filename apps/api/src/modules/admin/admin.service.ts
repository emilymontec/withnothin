import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { ReportsRepository } from '../reports/reports.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CommentsRepository } from '../comments/comments.repository';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { CursorPaginationDto } from '../../common/pagination/pagination.dto';

/**
 * Vista mínima de administración (v1): sin dashboard visual propio
 * todavía, solo los endpoints. Un panel web dedicado se construye
 * cuando haya un equipo de moderación real que lo necesite — hasta
 * entonces, estos endpoints son suficientes y se pueden operar desde
 * la propia web con un rol ADMIN, o incluso con curl/Postman.
 */
@Injectable()
export class AdminService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly reportsRepository: ReportsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async findUsers(query: CursorPaginationDto): Promise<AdminUserResponseDto[]> {
    const users = await this.usersRepository.findAllForAdmin(query.cursor, query.limit);
    return users.map(
      (u) =>
        new AdminUserResponseDto({
          id: u.id,
          email: u.email,
          role: u.role,
          username: u.profile?.username ?? null,
          displayName: u.profile?.displayName ?? null,
          isActive: u.deletedAt === null,
          createdAt: u.createdAt,
        }),
    );
  }

  async deactivateUser(userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.usersRepository.softDelete(userId);
  }

  async reactivateUser(userId: string): Promise<void> {
    await this.usersRepository.reactivate(userId);
  }

  findReports(status: string | undefined, query: CursorPaginationDto) {
    return this.reportsRepository.findAllForAdmin(status, query.cursor, query.limit);
  }

  async updateReportStatus(reportId: string, status: string) {
    const report = await this.reportsRepository.findRawById(reportId);
    if (!report) {
      throw new NotFoundException('Reporte no encontrado');
    }
    return this.reportsRepository.updateStatus(reportId, status);
  }

  /** Borrado forzado: a diferencia de PostsService.softDelete, un ADMIN no necesita ser el autor. */
  async removePost(postId: string): Promise<void> {
    const post = await this.postsRepository.findRawById(postId);
    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }
    await this.postsRepository.softDelete(postId);
  }

  async removeComment(commentId: string): Promise<void> {
    const comment = await this.commentsRepository.findRawById(commentId);
    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }
    await this.commentsRepository.softDelete(commentId);
  }
}
