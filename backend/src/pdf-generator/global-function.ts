interface Student {
  id: string;
  name: string;
  finalAverage: number;
  status: string;
  sex: string;
  [subject: string]: any; // allows dynamic subject keys like Math, Science, etc.
}

interface QuarterEntry {
  id: string;
  name: string;
  finalAverage: number;
  sex: string;
  final_avg: string | null;
  status: string | null;
  rounded_avg: number | null;
  [subject: string]: any; // dynamic subject score fields
}

interface QuarterGroup {
  male: QuarterEntry[];
  female: QuarterEntry[];
}

export function groupByQuarter(
  students: Student[],
  metaKeys: string[] = ['id', 'name', 'finalAverage', 'status', 'sex'],
  passingGrade: number = 75,
): Record<string, QuarterGroup> {
  // discover every quarter key actually present across all students/subjects
  const quarterSet = new Set<string>();
  students.forEach((student) => {
    Object.keys(student)
      .filter((key) => !metaKeys.includes(key))
      .forEach((subject) => {
        Object.keys(student[subject] || {}).forEach((q) => quarterSet.add(q));
      });
  });

  const order = ['q1', 'q2', 'q3', 'q4'];
  const quarters = order.filter((q) => quarterSet.has(q));

  const result: Record<string, QuarterGroup> = {};

  quarters.forEach((q) => {
    const entries: QuarterEntry[] = students.map((student) => {
      const entry = {} as QuarterEntry;

      metaKeys.forEach((key) => {
        (entry as any)[key] = student[key];
      });

      const subjectKeys = Object.keys(student).filter(
        (key) => !metaKeys.includes(key),
      );
      const scores: number[] = [];

      subjectKeys.forEach((subject) => {
        const score = student[subject]?.[q] ?? null;
        entry[subject] = score;
        if (typeof score === 'number') scores.push(score);
      });

      const rawAvg = scores.length
        ? scores.reduce((sum, s) => sum + s, 0) / scores.length
        : null;

      entry.final_avg = rawAvg !== null ? rawAvg.toFixed(3) : null;
      entry.status =
        rawAvg !== null ? (rawAvg >= passingGrade ? 'Passed' : 'Failed') : null;
      entry.rounded_avg = rawAvg !== null ? Math.round(rawAvg) : null;

      return entry;
    });

    // split this quarter's entries by sex, case-insensitively
    result[q] = {
      male: entries.filter((e) => String(e.sex).toLowerCase() === 'male'),
      female: entries.filter((e) => String(e.sex).toLowerCase() === 'female'),
    };
  });

  return result;
}
