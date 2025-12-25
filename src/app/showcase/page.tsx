import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp,
  Plus,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

/**
 * Component Showcase - Advocate Pro Design System
 * 
 * This file demonstrates all the redesigned components
 * Use these patterns when building new features
 */

export default function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8">
      <div className="max-w-[1600px] mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-5xl font-bold text-slate-900 mb-2">Component Showcase</h1>
          <p className="text-lg text-slate-600">Advocate Pro Design System</p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Buttons</h2>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button>Default Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Plus className="h-5 w-5" /></Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="gap-2">
                  <Plus className="h-5 w-5" /> With Icon
                </Button>
                <Button className="gap-2">
                  Continue <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* KPI Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Cases</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-4xl font-bold text-slate-900">247</h3>
                  <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    +12%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  This is the card content area. Use it for detailed information.
                </p>
              </CardContent>
            </Card>

            {/* List Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
              <div className="h-1 bg-blue-500" />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Case #2024-001</h3>
                    <p className="text-sm text-slate-600 mt-1">Property Dispute</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex gap-2">
                  <Badge>Open</Badge>
                  <Badge variant="outline">High Priority</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Badges</h2>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">Open</Badge>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">In Progress</Badge>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Completed</Badge>
                <Badge className="bg-slate-100 text-slate-700 border-slate-200">Closed</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Inputs Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Input Fields</h2>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Default Input</label>
                <Input placeholder="Enter text..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Search Input</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input placeholder="Search..." className="pl-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Large Input</label>
                <Input placeholder="Large input..." className="h-12 text-base" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Icons Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Icon Library</h2>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {[
                  Briefcase,
                  Users,
                  Calendar,
                  FileText,
                  Plus,
                  Search,
                  ArrowRight,
                  TrendingUp,
                  CheckCircle2,
                  AlertCircle,
                ].map((Icon, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                      <Icon className="h-6 w-6 text-slate-700" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Status Indicators */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Status Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 flex items-center justify-between bg-emerald-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-900">Success State</span>
                </div>
                <span className="text-lg font-bold text-emerald-600">24</span>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 flex items-center justify-between bg-amber-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-slate-900">Warning State</span>
                </div>
                <span className="text-lg font-bold text-amber-600">8</span>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 flex items-center justify-between bg-red-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-slate-900">Error State</span>
                </div>
                <span className="text-lg font-bold text-red-600">3</span>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Color Palette</h2>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-slate-900" />
                  <p className="text-xs font-medium text-slate-600">Primary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-amber-500" />
                  <p className="text-xs font-medium text-slate-600">Accent Gold</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-emerald-500" />
                  <p className="text-xs font-medium text-slate-600">Success</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-blue-500" />
                  <p className="text-xs font-medium text-slate-600">Info</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-slate-100 border-2 border-slate-200" />
                  <p className="text-xs font-medium text-slate-600">Background</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
