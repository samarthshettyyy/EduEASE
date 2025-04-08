// db/migrations/0002_document_tables.ts
import { sql } from "drizzle-orm";
import { int, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export async function up(db) {
  // Create classrooms table if it doesn't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS classrooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      subject VARCHAR(100),
      teacher_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create classroom_students junction table if it doesn't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS classroom_students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      classroom_id INT NOT NULL,
      student_id INT NOT NULL,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY classroom_student_idx (classroom_id, student_id),
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create documents table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS documents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      file_url VARCHAR(2048) NOT NULL,
      file_type VARCHAR(100) NOT NULL,
      file_size INT NOT NULL,
      teacher_id INT NOT NULL,
      classroom_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
    );
  `);

  // Create student_documents junction table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS student_documents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      document_id INT NOT NULL,
      viewed INT DEFAULT 0,
      completed INT DEFAULT 0,
      first_viewed_at TIMESTAMP NULL,
      completed_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY student_document_idx (student_id, document_id),
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
    );
  `);

  // Create indexes for better query performance
  await db.execute(sql`CREATE INDEX idx_documents_classroom_id ON documents(classroom_id);`);
  await db.execute(sql`CREATE INDEX idx_documents_teacher_id ON documents(teacher_id);`);
  await db.execute(sql`CREATE INDEX idx_student_documents_student_id ON student_documents(student_id);`);
  await db.execute(sql`CREATE INDEX idx_student_documents_document_id ON student_documents(document_id);`);
  await db.execute(sql`CREATE INDEX idx_student_documents_viewed ON student_documents(viewed);`);
  await db.execute(sql`CREATE INDEX idx_student_documents_completed ON student_documents(completed);`);
}

export async function down(db) {
  // Drop tables in reverse order (dependencies first)
  await db.execute(sql`DROP TABLE IF EXISTS student_documents;`);
  await db.execute(sql`DROP TABLE IF EXISTS documents;`);
  await db.execute(sql`DROP TABLE IF EXISTS classroom_students;`);
  await db.execute(sql`DROP TABLE IF EXISTS classrooms;`);
}