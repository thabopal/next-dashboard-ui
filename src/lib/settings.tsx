export const ITEM_PER_PAGE = 10;

type RouteAccessMap = {
    [key: string]: string[];
  };

export const routeAccessMap: RouteAccessMap = {
    "/admin(.*)": ["admin"],
    "/learner(.*)": ["learner"],
    "/teacher(.*)": ["teacher"],
    "/parent(.*)": ["parent"],
    "/list/teachers": ["admin", "teacher"],
    "/list/learners": ["admin", "teacher"],
    "/list/parents": ["admin", "teacher"],
    "/list/subjects": ["admin"],
    "/list/classes": ["admin", "teacher"],
    "/list/exams": ["admin", "teacher", "learner", "parent"],
    "/list/assignments": ["admin", "teacher", "learner", "parent"],
    "/list/results": ["admin", "teacher", "learner", "parent"],
    "/list/attendance": ["admin", "teacher", "learner", "parent"],
    "/list/events": ["admin", "teacher", "learner", "parent"],
    "/list/announcements": ["admin", "teacher", "learner", "parent"],
  };