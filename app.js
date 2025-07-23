

// import express from 'express';
// import { exec } from 'child_process';
// import { join } from 'path';
// import { unlink } from 'fs/promises';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const app = express();

// // Resolve __dirname since it's not available in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// app.get('/create-download-backup', async (req, res) => {
//     const backupFile = join(__dirname, 'backup.sql');


//     const dumpCommand = `"C:\\xampp\\mysql\\bin\\mysqldump.exe" -u root myapp > "${backupFile}"`;



//     exec(dumpCommand, async (error, stdout, stderr) => {
//         if (error) {
//             console.error('Backup error:', stderr);
//             return res.status(500).send('Error generating backup');
//         }

//         res.download(backupFile, 'database_backup.sql', async (err) => {
//             if (err) {
//                 console.error('Download error:', err);
//             }
//             try {
//                 await unlink(backupFile);
//             } catch (unlinkErr) {
//                 console.error('Failed to delete backup file:', unlinkErr);
//             }
//         });
//     });
// });

// app.listen(3000, () => {
//     console.log('Server running on http://localhost:3000');
// });


import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();

app.get('/create-download-backup', (req, res) => {
    const backupFile = path.join(process.cwd(), 'pg_backup.sql');

    // Replace these with your actual values (or get from env)
    const host = 'database-2.c1g8kac0u1k6.ap-south-1.rds.amazonaws.com';
    const port = '5432';
    const user = 'postgres';
    const password = 'ynYBsv6dlNtvbunU0GjE'; // put your real password here
    const database = 'postgres';

    process.env.PGPASSWORD = password;

    const dumpCommand = `"C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe" -h ${host} -p ${port} -U ${user} -F p ${database} > "${backupFile}"`;
    ;

    exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
            console.error('Backup error:', stderr);
            return res.status(500).send('Error generating backup');
        }

        res.download(backupFile, 'pg_backup.sql', (err) => {
            if (err) console.error('Download error:', err);
            fs.unlinkSync(backupFile); // Delete backup after sending
        });
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

