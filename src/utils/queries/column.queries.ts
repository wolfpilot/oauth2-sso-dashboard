// Lib
import { db } from "@lib/database.lib"

export const safelyRemoveColumn = async () => {
  // Check if the column has any non-NULL values
  const result = await db
    .selectFrom("User")
    .select(db.fn.count("password_hash").as("nonNullCount"))
    .where("password_hash", "is not", null)
    .executeTakeFirst()

  console.log("result", result)
  console.log(
    "result?.nonNullCount",
    result?.nonNullCount,
    typeof result?.nonNullCount
  )

  // Check the result
  // if (result?.nonNullCount && result.nonNullCount > 0) {
  //   console.log(`Cannot delete the column. It still contains ${result.nonNullCount} non-null values.`);
  //   return;
  // }

  // // If column is empty, proceed to drop it
  // await db.schema
  //   .alterTable('User')
  //   .dropColumn('password_hash')
  //   .execute();

  // console.log('Column "password_hash" has been successfully removed.');
}
