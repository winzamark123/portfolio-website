import { spawn } from 'node:child_process';
import { startServiceFixture } from './service-fixture';

async function main() {
  const services = await startServiceFixture({ port: 4100 });
  const child = spawn(
    process.execPath,
    [
      'node_modules/next/dist/bin/next',
      process.env.WRITING_TEST_PRODUCTION === '1' ? 'start' : 'dev',
      '-p',
      '3100',
      '-H',
      '127.0.0.1',
    ],
    {
      stdio: 'inherit',
      env: { ...process.env, ...services.env },
    }
  );
  async function stop() {
    child.kill('SIGTERM');
    await services.close();
  }
  process.on('SIGTERM', () => void stop());
  process.on('SIGINT', () => void stop());
  child.on('exit', (code) => {
    void services.close().finally(() => process.exit(code ?? 0));
  });
}
void main();
