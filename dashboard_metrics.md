#Dashboard Data Sources

The dashboard provides a quick overview of system activity such as projects,
tasks, and user workload. It helps users and administrators track progress
and identify pending or overdue work efficiently.

Dashboard Metrics:
1. Total Users
2. Total Projects
3. Total Tasks
4. Completed Tasks
5. Pending Tasks
6. Overdue Tasks
7. Active Projects
8. Tasks Assigned to Logged-in User

Data Sources:
- User-related metrics are derived from the Users data model.
- Project-related metrics are derived from the Projects data model.
- Task-related metrics are derived from the Tasks data model.

Metric Mapping:
- Total Users: Count of all user records.
- Total Projects: Count of all project records.
- Total Tasks: Count of all task records.
- Completed Tasks: Tasks whose status is marked as completed.
- Pending Tasks: Tasks whose status is marked as pending.
- Overdue Tasks: Tasks with due date passed and not completed.
- Active Projects: Projects with active status.
- Tasks Assigned to User: Tasks linked to the current user.

Aggregation Logic:
- Counts are calculated by iterating over relevant records.
- Status-based filtering is applied to categorize tasks.
- Date comparison is used to identify overdue tasks.
- User-specific metrics are filtered using user identifiers.

Performance Considerations:
- Frequently accessed fields such as status and user identifiers
  should be indexed.
- Dashboard data can be cached to reduce repeated calculations.
- Aggregations should be optimized to avoid full data scans.

This dashboard planning ensures that all metrics have clearly
defined data sources and calculation logic, enabling fast and
scalable dashboard rendering.

