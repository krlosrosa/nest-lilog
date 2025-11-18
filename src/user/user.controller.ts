import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueriesDtoUserCenter } from './dto/queries.dto';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { AccountId } from 'src/_shared/decorators/account-id.decorator';
import { ZodResponse } from 'nestjs-zod';
import { InfoMeDto } from './dto/infoMe.dto';
import { RoleDto } from './dto/role.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/listUser.dto';
import { EditUserDto } from './dto/updateUser.dto';

@Controller('user')
@ApiTags('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'criar usuario',
    operationId: 'criarUsuario',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario criado com sucesso',
    type: UserDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/batch')
  @ApiOperation({
    summary: 'criar usuario em massa',
    operationId: 'criarUsuarioEmMassa',
  })
  @ApiBody({
    type: [CreateUserDto],
  })
  createBatch(@Body() createUserDto: CreateUserDto[]) {
    return this.userService.createbath(createUserDto);
  }

  @Get('userid/:centerId')
  @ApiOperation({
    summary: 'usuario',
    operationId: 'listarUsuarios',
  })
  @ZodResponse({ type: [UserDto], status: HttpStatus.OK })
  findAll(
    @Param('centerId') centerId: string,
    @Query() query?: QueriesDtoUserCenter,
  ): Promise<UserDto[]> {
    return this.userService.findAll(centerId, query);
  }

  @Get('info-me')
  @ZodResponse({ type: InfoMeDto, status: HttpStatus.OK })
  infoMe(
    @AccountId() accountId: string, // ✅ direto aqui
  ): Promise<InfoMeDto> {
    const resultado = this.userService.infoMe(accountId);
    return resultado;
  }

  @Get('get-roles')
  @ApiOperation({
    summary: 'Buscar roles',
    operationId: 'getRoles',
  })
  @ZodResponse({ type: [RoleDto], status: HttpStatus.OK })
  getAllRoles(): Promise<RoleDto[]> {
    return this.userService.buscarRoles();
  }

  @Post('criar-role/:id')
  @ApiOperation({
    summary: 'Criar nova Role',
    operationId: 'criarRole',
  })
  criarNovaRole(
    @Param('id') id: string, // ✅ direto aqui
  ) {
    return this.userService.criarRoles(id);
  }

  @Delete(':id/:centerId')
  @ApiOperation({
    summary: 'Deletar Usuario',
    operationId: 'deletarUsuario',
  })
  remove(
    @Param('id') id: string,
    @Param('centerId') centerId: string,
  ): Promise<void> {
    return this.userService.remove(id, centerId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar Usuario',
    operationId: 'atualizarUsuario',
  })
  atualizar(@Param('id') id: string, @Body() nome: EditUserDto): Promise<void> {
    return this.userService.update(id, nome);
  }

  @Post('reset-password/:id/:password')
  @ApiOperation({
    summary: 'Resetar senha',
    operationId: 'resetarSenha',
  })
  resetPassword(
    @Param('id') id: string,
    @Param('password') password: string,
  ): Promise<void> {
    return this.userService.resetSenha(id, password);
  }

  @Put('update-permissions/:id/:centerId')
  @ApiOperation({
    summary: 'Atualizar permissões',
    operationId: 'atualizarPermissoes',
  })
  updatePermissions(
    @Param('id') id: string,
    @Param('centerId') centerId: string,
    @Body() permissions: string[],
  ): Promise<void> {
    return this.userService.updatePermissions(id, centerId, permissions);
  }

  @Get('get-all-permissions-by-center/:userId/:centerId')
  @ApiOperation({
    summary: 'Buscar todas as permissões por centro',
    operationId: 'buscarTodasPermissoesPorCentro',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Permissões encontradas',
    type: [String],
  })
  getAllPermissionsByCenter(
    @Param('userId') userId: string,
    @Param('centerId') centerId: string,
  ): Promise<string[]> {
    return this.userService.getAllPermissionsByCenter(userId, centerId);
  }

  //Signout
  @Post('logout/:userId')
  @ApiOperation({
    summary: 'Encerrar sessão',
    operationId: 'encerrarSessao',
  })
  logout(@Param('userId') userId: string): Promise<void> {
    return this.userService.logout(userId);
  }
}
