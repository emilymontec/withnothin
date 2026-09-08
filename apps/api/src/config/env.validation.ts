import { IsIn, IsNumber, IsOptional, IsString, IsUrl, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * Contrato explícito de las variables de entorno requeridas por la API.
 * Si falta o es inválida alguna, la aplicación falla al arrancar
 * en lugar de fallar silenciosamente en tiempo de ejecución.
 */
class EnvironmentVariables {
  @IsIn(['development', 'staging', 'production', 'test'])
  NODE_ENV: string;

  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsUrl({ require_tld: false })
  SUPABASE_URL: string;

  @IsString()
  SUPABASE_ANON_KEY: string;

  @IsString()
  SUPABASE_SERVICE_ROLE_KEY: string;

  @IsOptional()
  @IsString()
  SUPABASE_STORAGE_BUCKET?: string;

  @IsString()
  JWT_PUBLIC_KEY_OR_SECRET: string;

  @IsString()
  CORS_ORIGIN: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(
      `Configuración de entorno inválida:\n${errors
        .map((e) => Object.values(e.constraints ?? {}).join(', '))
        .join('\n')}`,
    );
  }

  return validatedConfig;
}
