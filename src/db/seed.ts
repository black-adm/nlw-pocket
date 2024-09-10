import { client, db } from "./connection";
import { goalCompletions, goals } from "./schema";

import dayjs from "dayjs";

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      { title: "Ir para academia", desiredWeeklyFrequency: 3 },
      { title: "Estudar C# com Dotnet", desiredWeeklyFrequency: 5 },
      { title: "Dormir 10 horas", desiredWeeklyFrequency: 1 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[0].id, createdAt: startOfWeek.add(1, "day").toDate() },
  ]);
}

seed().finally(() => {
  client.end();
});
