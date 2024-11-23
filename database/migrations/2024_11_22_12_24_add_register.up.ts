import { Kysely } from "kysely"

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("User")
    .addColumn("password_hash", "varchar(72)", )
    .execute()
  }
