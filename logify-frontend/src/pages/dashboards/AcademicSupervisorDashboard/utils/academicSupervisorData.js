import { api } from "../../../../config/api";

const toArray = (value) => (Array.isArray(value) ? value : []);

export const formatDate = (value) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateRange = (start, end) => {
  const startLabel = formatDate(start);
  const endLabel = formatDate(end);
  if (startLabel === "N/A" && endLabel === "N/A") {
    return "Schedule unavailable";
  }
  return `${startLabel} - ${endLabel}`;
};

export const formatRelativeTime = (value) => {
  if (!value) return "Recently";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Recently";
  const diffInMs = Date.now() - parsed.getTime();
  const diffInDays = Math.max(0, Math.floor(diffInMs / (1000 * 60 * 60 * 24)));
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
};

export const getPlacementProgress = (placement) => {
  const startDate = new Date(placement?.start_date);
  const endDate = new Date(placement?.end_date);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    endDate <= startDate
  ) {
    return { progress: 0, weekLabel: "Schedule unavailable" };
  }

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = Date.now() - startDate.getTime();
  const progress = Math.min(
    100,
    Math.max(0, Math.round((elapsed / totalDuration) * 100)),
  );
  const totalWeeks = Math.max(
    1,
    Math.ceil(totalDuration / (1000 * 60 * 60 * 24 * 7)),
  );
  const currentWeek = Math.min(
    totalWeeks,
    Math.max(1, Math.ceil(Math.max(0, elapsed) / (1000 * 60 * 60 * 24 * 7))),
  );

  return {
    progress,
    weekLabel: `Week ${currentWeek}/${totalWeeks}`,
  };
};

export const getUserDisplayName = (user, fallback = "Unknown User") => {
  if (!user) return fallback;
  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  return fullName || user.email || fallback;
};

export const buildEvaluationCriteria = ({
  evaluation,
  scores,
  criteriaById,
  scoreDrafts = {},
}) => {
  const linkedScores = scores
    .filter((score) => score.evaluation === evaluation.id)
    .map((score) => {
      const criterion = criteriaById[score.criterion];
      const maxScore = criterion?.max_score || 100;
      const weightPercent = Number(criterion?.weight_percent || 0);
      const draftKey = `${evaluation.placement}-${criterion?.id || score.criterion}`;
      const draft = scoreDrafts[draftKey];
      const numericScore = Number(draft?.score ?? score.score ?? 0);
      return {
        id: score.id,
        criterionId: criterion?.id || score.criterion,
        draftKey,
        title: criterion?.name || "Assessment Criterion",
        weight: weightPercent ? `${weightPercent}%` : "N/A",
        score: Math.round((numericScore / maxScore) * 100),
        rawScore: numericScore,
        maxScore,
        note: criterion?.description || "Criterion details unavailable.",
        contribution: weightPercent
          ? `${Math.round((numericScore / maxScore) * weightPercent)}%`
          : "N/A",
        comment: draft?.comment ?? score.comment ?? "",
      };
    });

  if (linkedScores.length > 0) {
    return linkedScores;
  }

  const rubricCriteria = Object.values(criteriaById)
    .filter((criterion) => criterion.rubric === evaluation.rubric)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (rubricCriteria.length > 0) {
    return rubricCriteria.map((criterion) => {
      const maxScore = criterion.max_score || 100;
      const weightPercent = Number(criterion.weight_percent || 0);
      const draftKey = `${evaluation.placement}-${criterion.id}`;
      const draft = scoreDrafts[draftKey];
      const numericScore = Number(draft?.score ?? 0);

      return {
        id: null,
        criterionId: criterion.id,
        draftKey,
        title: criterion.name || "Assessment Criterion",
        weight: weightPercent ? `${weightPercent}%` : "N/A",
        score: Math.round((numericScore / maxScore) * 100),
        rawScore: numericScore,
        maxScore,
        note: criterion.description || "Criterion details unavailable.",
        contribution: weightPercent
          ? `${Math.round((numericScore / maxScore) * weightPercent)}%`
          : "N/A",
        comment: draft?.comment ?? "",
      };
    });
  }

  return [
    {
      id: null,
      criterionId: null,
      draftKey: `${evaluation.placement}-overall`,
      title: "Overall Evaluation",
      weight: "100%",
      score: Math.round(Number(evaluation.total_score || 0)),
      rawScore: Number(evaluation.total_score || 0),
      maxScore: 100,
      note: "Detailed score criteria were not returned by the backend.",
      contribution: `${Math.round(Number(evaluation.total_score || 0))}%`,
      comment: "",
    },
  ];
};

export const loadAcademicSupervisorData = async () => {
  const [
    me,
    placementsResponse,
    weeklyLogsResponse,
    evaluationsResponse,
    scoresResponse,
    criteriaResponse,
    resultsResponse,
    rubricsResponse,
    programmesResponse,
    departmentsResponse,
  ] = await Promise.all([
    api.auth.me(),
    api.placements.getPlacements(),
    api.logbook.getWeeklyLogs(),
    api.evaluations.getEvaluations(),
    api.evaluations.getScores(),
    api.evaluations.getCriteria(),
    api.evaluations.getResults(),
  ]);

  const placements = toArray(placementsResponse);
  const weeklyLogs = toArray(weeklyLogsResponse?.weekly_logs);
  const evaluations = toArray(evaluationsResponse);
  const scores = toArray(scoresResponse);
  const criteria = toArray(criteriaResponse);
  const results = toArray(resultsResponse);

  const uniqueInternIds = [
    ...new Set(placements.map((item) => item.intern).filter(Boolean)),
  ];
  const uniqueOrganizationIds = [
    ...new Set(placements.map((item) => item.organization).filter(Boolean)),
  ];
  const uniqueWorkplaceSupervisorIds = [
    ...new Set(
      placements.map((item) => item.workplace_supervisor).filter(Boolean),
    ),
  ];

  const usersById = {};
  const organizationsById = {};
  const workplaceSupervisorsById = {};
  const criteriaById = Object.fromEntries(
    criteria.map((item) => [item.id, item]),
  );
  const placementById = Object.fromEntries(
    placements.map((item) => [item.id, item]),
  );
  const resultByPlacementId = Object.fromEntries(
    results.map((item) => [item.placement, item]),
  );

  await Promise.all(
    uniqueInternIds.map(async (id) => {
      try {
        usersById[id] = await api.accounts.getUser(id);
      } catch {
        usersById[id] = null;
      }
    }),
  );

  await Promise.all(
    uniqueOrganizationIds.map(async (id) => {
      try {
        organizationsById[id] = await api.organizations.getOrganization(id);
      } catch {
        organizationsById[id] = null;
      }
    }),
  );

  await Promise.all(
    uniqueWorkplaceSupervisorIds.map(async (id) => {
      try {
        workplaceSupervisorsById[id] = await api.accounts.getUser(id);
      } catch {
        workplaceSupervisorsById[id] = null;
      }
    }),
  );

  return {
    me,
    placements,
    weeklyLogs,
    evaluations,
    scores,
    criteria,
    results,
    usersById,
    organizationsById,
    workplaceSupervisorsById,
    criteriaById,
    placementById,
    resultByPlacementId,
  };
};
