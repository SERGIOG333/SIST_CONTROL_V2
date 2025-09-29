// migrate.js
import { runMigration } from './migracion_sist_controlV2.js';

runMigration()
  .then((result) => {
    if (result.success) {
      console.log('Migration completed successfully');
      process.exit(0);
    } else {
      console.error('Migration failed:', result.error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Unhandled migration error:', error);
    process.exit(1);
  });