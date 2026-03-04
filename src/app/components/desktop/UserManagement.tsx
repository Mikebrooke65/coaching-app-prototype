import { useState } from "react";
import { Search, Plus, Edit, Trash2, UserPlus, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'coach' | 'manager' | 'admin' | 'player' | 'caregiver';
  team: string;
  status: 'active' | 'pending' | 'inactive';
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Mock data
  const users: UserData[] = [
    { id: '1', name: 'John Smith', email: 'john.smith@wcr.com', role: 'coach', team: 'U10 Rangers', status: 'active' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.j@wcr.com', role: 'manager', team: 'U12 Rangers Blue', status: 'active' },
    { id: '3', name: 'Michael Brown', email: 'mbrown@wcr.com', role: 'coach', team: 'U8 Rangers', status: 'active' },
    { id: '4', name: 'Emma Wilson', email: 'emma.w@wcr.com', role: 'admin', team: 'All Teams', status: 'active' },
    { id: '5', name: 'David Lee', email: 'david.lee@wcr.com', role: 'coach', team: 'U14 Rangers', status: 'pending' },
    { id: '6', name: 'Lisa Martinez', email: 'lisa.m@wcr.com', role: 'caregiver', team: 'U10 Rangers', status: 'active' },
    { id: '7', name: 'James Taylor', email: 'jtaylor@wcr.com', role: 'player', team: 'U12 Rangers Blue', status: 'active' },
    { id: '8', name: 'Jessica Davis', email: 'jdavis@wcr.com', role: 'coach', team: 'U16 Rangers', status: 'active' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.team.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'coach': return 'bg-green-100 text-green-800';
      case 'player': return 'bg-orange-100 text-orange-800';
      case 'caregiver': return 'bg-gray-100 text-gray-800';
      default: return '';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Add, edit, and manage user accounts and role assignments</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
                <SelectItem value="player">Player</SelectItem>
                <SelectItem value="caregiver">Caregiver</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              Send Invites
            </Button>
            <Button className="gap-2 bg-[#0091f3] hover:bg-[#0081d8]">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0091f3]/10 flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-[#0091f3]" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">{user.email}</span>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">{user.team}</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'active' ? 'default' : user.status === 'pending' ? 'secondary' : 'outline'}
                    className={
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : user.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : ''
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4 mt-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Coaches</p>
          <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'coach').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Players</p>
          <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'player').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Caregivers</p>
          <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'caregiver').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'pending').length}</p>
        </div>
      </div>
    </div>
  );
}
