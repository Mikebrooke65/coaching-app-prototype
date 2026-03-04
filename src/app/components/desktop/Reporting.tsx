import { useState } from "react";
import { Download, Calendar, TrendingUp, Users, Trophy, BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const attendanceData = [
  { month: 'Sep', attendance: 85 },
  { month: 'Oct', attendance: 88 },
  { month: 'Nov', attendance: 82 },
  { month: 'Dec', attendance: 79 },
  { month: 'Jan', attendance: 91 },
  { month: 'Feb', attendance: 87 },
];

const teamPerformanceData = [
  { team: 'U8', wins: 8, draws: 3, losses: 2 },
  { team: 'U10', wins: 10, draws: 2, losses: 1 },
  { team: 'U12 Blue', wins: 7, draws: 4, losses: 2 },
  { team: 'U12 White', wins: 6, draws: 5, losses: 2 },
  { team: 'U14', wins: 9, draws: 2, losses: 2 },
  { team: 'U16', wins: 11, draws: 1, losses: 1 },
];

const trainingSessionsData = [
  { name: 'Technical', value: 35 },
  { name: 'Tactical', value: 25 },
  { name: 'Physical', value: 20 },
  { name: 'Mental', value: 12 },
  { name: 'Other', value: 8 },
];

const COLORS = ['#0091f3', '#ea7800', '#22c55e', '#8b5cf6', '#545859'];

export function Reporting() {
  const [dateRange, setDateRange] = useState("last-6-months");
  const [selectedTeam, setSelectedTeam] = useState("all");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reporting & Analytics</h1>
        <p className="text-gray-600">Track attendance, performance, and club-wide metrics</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="u8">U8 Rangers</SelectItem>
                <SelectItem value="u10">U10 Rangers</SelectItem>
                <SelectItem value="u12-blue">U12 Rangers Blue</SelectItem>
                <SelectItem value="u12-white">U12 Rangers White</SelectItem>
                <SelectItem value="u14">U14 Rangers</SelectItem>
                <SelectItem value="u16">U16 Rangers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#0091f3]" />
            </div>
            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +5.2%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg Attendance</p>
          <p className="text-2xl font-bold text-gray-900">86.8%</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[#ea7800]" />
            </div>
            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.1%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Games Won</p>
          <p className="text-2xl font-bold text-gray-900">51</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +8.3%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Sessions Delivered</p>
          <p className="text-2xl font-bold text-gray-900">142</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">This month</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Players</p>
          <p className="text-2xl font-bold text-gray-900">127</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Attendance Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#0091f3" 
                strokeWidth={3}
                name="Attendance %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="team" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Bar dataKey="wins" fill="#22c55e" name="Wins" />
              <Bar dataKey="draws" fill="#ea7800" name="Draws" />
              <Bar dataKey="losses" fill="#ef4444" name="Losses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Training Sessions Breakdown */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Sessions by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trainingSessionsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {trainingSessionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#0091f3] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Attendance Improvement</p>
                <p className="text-sm text-gray-600">Overall attendance has increased by 5.2% compared to the previous period, with U16 Rangers showing the highest improvement at 12%.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Strong Performance</p>
                <p className="text-sm text-gray-600">U16 Rangers leads with an 85% win rate (11 wins, 1 draw, 1 loss). Technical training sessions correlate with improved match outcomes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#ea7800] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Training Delivery</p>
                <p className="text-sm text-gray-600">142 sessions delivered across all teams. Technical training (35%) is the most common session type, followed by Tactical (25%).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
