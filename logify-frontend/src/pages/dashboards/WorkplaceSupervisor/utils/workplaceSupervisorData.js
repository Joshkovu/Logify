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

export const loadWorkplaceSupervisorData = async () => {
  const [me, placementsResponse, weeklyLogsResponse] = await Promise.all([
    api.auth.me(),
    api.placements.getPlacements(),
    api.logbook.getWeeklyLogs(),
  ]);

  const placements = toArray(placementsResponse);
  const weeklyLogs = toArray(weeklyLogsResponse?.weekly_logs);

  const uniqueInternIds = [
    ...new Set(placements.map((p) => p.intern).filter(Boolean)),
  ];
  const uniqueOrganizationIds = [
    ...new Set(placements.map((p) => p.organization).filter(Boolean)),
  ];

  const usersById = {};
  const organizationsById = {};

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

  return {
    me,
    placements,
    weeklyLogs,
    usersById,
    organizationsById,
  };
};
