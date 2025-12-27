export class DashboardStats {
  totalStats: TotalStats[];
  deptStats: DepartmentStats[];
  positionStats: PositionStats[];
}

export class TotalStats {
  totalEmployees: number;
  totalSalary: number;
  avgSalary: number;
}

export class DepartmentStats {
  _id: string;
  count: number;
}

export class PositionStats {
  _id: string;
  count: number;
}
