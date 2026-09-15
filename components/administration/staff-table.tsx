import { StatusPill } from "@/components/ui/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRole } from "@/lib/auth/display";
import type { StaffUser } from "@/lib/administration/types";

export function StaffTable({ staff }: { staff: StaffUser[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatRole(user.role)}</TableCell>
            <TableCell>
              <StatusPill
                status={user.isActive ? "CONFIRMED" : "CANCELLED"}
                label={user.isActive ? "Active" : "Inactive"}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
