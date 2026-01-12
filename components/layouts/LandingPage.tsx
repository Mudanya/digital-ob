"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  FileText,
  BarChart3,
  Clock,
  MapPin,
  Bell,
  Lock,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Building2,
  UserCheck,
  Database,
  Smartphone,
  Monitor,
  HelpCircle,
  Mail,
  ChevronDown,
  Zap,
  Globe,
  TrendingUp,
} from "lucide-react";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState<string | null>(null);

  const objectives = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Continuous Data Collection",
      desc: "Real-time occurrence book entries across all police stations nationwide",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Secure Storage & Management",
      desc: "Centralized, encrypted database with role-based access control",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Enhanced Analytics",
      desc: "Data-driven insights for crime patterns, resource allocation, and decision-making",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Integrated Justice System",
      desc: "Seamless coordination between police, judiciary, and administrative bodies",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Operational Efficiency",
      desc: "Paperless workflows, reduced case processing time, and improved accountability",
    },
  ];

  const hierarchy = [
    {
      level: "National Command",
      roles: ["Inspector General (IG)", "Deputy Inspector General (DIG)"],
      color: "from-red-500 to-red-600",
      access: [
        "National Dashboard & Analytics",
        "All Station OB Access",
        "Super Admin Rights",
        "System-wide Configuration",
        "Officer Management Nationwide",
      ],
    },
    {
      level: "County/Regional Command",
      roles: ["County Commanders", "OCPDs", "Regional Heads"],
      color: "from-orange-500 to-orange-600",
      access: [
        "County/Regional Dashboards",
        "Multi-Station Monitoring",
        "Case Escalation Management",
        "Resource Allocation",
        "Performance Analytics",
      ],
    },
    {
      level: "Station Command",
      roles: ["OCS (Officer Commanding Station)", "Station Inspectors"],
      color: "from-blue-500 to-blue-600",
      access: [
        "Full Station OB Management",
        "Duty Roster Management",
        "Case Approval & Oversight",
        "Local Reporting & Analytics",
        "Officer Assignment",
      ],
    },
    {
      level: "Field Officers",
      roles: ["OCP", "Inspectors", "Sergeants", "Corporals", "Constables"],
      color: "from-green-500 to-green-600",
      access: [
        "Daily OB Entries",
        "Traffic Offense Logging",
        "Case Updates",
        "Court File Management",
        "Real-time Notifications",
      ],
    },
  ];

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Digital OB Entries",
      desc: "Replace paper records with secure, searchable digital entries",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Real-time Updates",
      desc: "Instant synchronization across all authorized devices and stations",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Geo-tagging",
      desc: "Location-based case logging and incident mapping",
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Smart Notifications",
      desc: "Automated alerts for case updates, escalations, and duty assignments",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      desc: "Crime pattern analysis, resource optimization, and performance metrics",
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: "Role-Based Access",
      desc: "Hierarchical permissions matching police service structure",
    },
  ];

  const loginPortals = [
    {
      title: "Field Officers",
      desc: "Constables, Corporals, Sergeants",
      icon: <Shield className="h-8 w-8" />,
      color: "from-green-500 to-green-600",
      href: "/login/officer",
    },
    {
      title: "Station Admin",
      desc: "OCS, Station Inspectors",
      icon: <Building2 className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600",
      href: "/login/station-admin",
    },
    {
      title: "Regional Admin",
      desc: "County Commanders, OCPDs",
      icon: <Users className="h-8 w-8" />,
      color: "from-orange-500 to-orange-600",
      href: "/login/regional-admin",
    },
    {
      title: "Super Admin",
      desc: "IG, DIG, National Command",
      icon: <Lock className="h-8 w-8" />,
      color: "from-red-500 to-red-600",
      href: "/login/super-admin",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#1a2332] to-[#1e3a5f] backdrop-blur-xl shadow-lg border-b border-yellow-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg border border-yellow-500/40">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Digital OB</h1>
                <p className="text-xs text-gray-400">Kenya Police Service</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-300 hover:text-white transition">
                About
              </a>
              <a href="#structure" className="text-gray-300 hover:text-white transition">
                Structure
              </a>
              <a href="#features" className="text-gray-300 hover:text-white transition">
                Features
              </a>
              <a href="#login" className="text-gray-300 hover:text-white transition">
                Login
              </a>
              <a href="#support" className="text-gray-300 hover:text-white transition">
                Support
              </a>
              <Link
                href="/login/officer"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-md"
              >
                Officer Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-white/10">
              <a
                href="#about"
                className="block text-gray-300 hover:text-white transition py-2"
              >
                About
              </a>
              <a
                href="#structure"
                className="block text-gray-300 hover:text-white transition py-2"
              >
                Structure
              </a>
              <a
                href="#features"
                className="block text-gray-300 hover:text-white transition py-2"
              >
                Features
              </a>
              <a
                href="#login"
                className="block text-gray-300 hover:text-white transition py-2"
              >
                Login
              </a>
              <a
                href="#support"
                className="block text-gray-300 hover:text-white transition py-2"
              >
                Support
              </a>
              <Link
                href="/login/officer"
                className="block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-center"
              >
                Officer Login
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm mb-6 font-semibold shadow-md">
            <Globe className="h-4 w-4" />
            Modernizing Justice & Security in Kenya
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Digital OB
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto font-semibold">
            A digital bridge between Administration, Police, and Judiciary
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Transforming law enforcement record-keeping with real-time digital occurrence
            book management
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login/officer"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Shield className="h-5 w-5" />
              Login as Officer
            </Link>
            <Link
              href="/login/station-admin"
              className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Building2 className="h-5 w-5" />
              Login as Admin
            </Link>
            <a
              href="#about"
              className="px-8 py-4 bg-gray-100 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2 shadow-md"
            >
              Learn More
              <ChevronDown className="h-5 w-5" />
            </a>
          </div>

          {/* Quick Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Police Stations", value: "800+" },
              { label: "Active Officers", value: "100K+" },
              { label: "Daily Entries", value: "5000+" },
              { label: "System Uptime", value: "99.9%" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 hover:shadow-xl hover:border-blue-400 transition-all"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-700 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Digital OB
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              The Digital Occurrence Book (OB) system is a transformative platform designed
              to modernize how Kenya Police Service manages crime records, cases, and
              investigations. By integrating administration, police operations, and the
              judiciary into a unified digital ecosystem, we're creating a more efficient,
              transparent, and accountable justice system.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8 md:p-12 mb-12 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-700 text-lg">
                  To establish a comprehensive digital infrastructure for continuous data
                  collection, secure storage, and intelligent management of all police
                  occurrence book entries across Kenya, enabling data-driven decision-making
                  and fostering collaboration between law enforcement and judicial systems.
                </p>
              </div>
            </div>
          </div>

          {/* Objectives Grid */}
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Key Objectives
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 hover:shadow-xl hover:border-blue-400 transition-all"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 text-white shadow-md">
                  {objective.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {objective.title}
                </h4>
                <p className="text-gray-600">{objective.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Police Structure Section */}
      <section id="structure" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Police Service Structure
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Digital OB is designed to match Kenya Police Service hierarchy, with
              role-based access and features tailored to each command level
            </p>
          </div>

          <div className="space-y-6">
            {hierarchy.map((level, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all"
              >
                <button
                  onClick={() =>
                    setSelectedRank(selectedRank === level.level ? null : level.level)
                  }
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 bg-gradient-to-br ${level.color} rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {level.level}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {level.roles.join(", ")}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-6 w-6 text-gray-500 transition-transform ${
                      selectedRank === level.level ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {selectedRank === level.level && (
                  <div className="px-6 pb-6 border-t border-gray-200 bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-4">
                      System Access & Capabilities:
                    </h4>
                    <ul className="space-y-2">
                      {level.access.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Built for the modern police force with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 shadow-lg rounded-xl p-8 hover:shadow-xl hover:border-blue-400 transition-all group"
              >
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Applications
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Access Digital OB through multiple platforms designed for your workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Desktop Application */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Monitor className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Desktop Application
                  </h3>
                  <p className="text-purple-700">Front & Back Office</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  OB entry and case management
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  Duty roster management
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  Real-time case logging
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  Offline capabilities
                </li>
              </ul>
            </div>

            {/* Management System */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Management System
                  </h3>
                  <p className="text-orange-700">Senior Officers & Admins</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  Advanced analytics and dashboards
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  User and officer management
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  Role-based access control (RBAC)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  API integration with external systems
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Login Portals Section */}
      <section id="login" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Login Portals
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Select your access level to login to the system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loginPortals.map((portal, index) => (
              <Link
                key={index}
                href={portal.href}
                className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 hover:shadow-xl hover:border-blue-400 transition-all group text-center"
              >
                <div
                  className={`h-16 w-16 bg-gradient-to-br ${portal.color} rounded-xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform shadow-md`}
                >
                  {portal.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {portal.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{portal.desc}</p>
                <div className="flex items-center justify-center gap-2 text-blue-600 group-hover:gap-3 transition-all font-semibold">
                  <span className="text-sm">Access Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Resources
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Everything you need to get started
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition-all">
              <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">FAQs</h3>
              <p className="text-gray-600 mb-4">
                Common questions and answers for officers
              </p>
              <a
                href="/faqs"
                className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-2"
              >
                View FAQs <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition-all">
              <Monitor className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tutorials
              </h3>
              <p className="text-gray-600 mb-4">
                Step-by-step guides and video demos
              </p>
              <a
                href="/tutorials"
                className="text-purple-600 hover:text-purple-700 inline-flex items-center gap-2"
              >
                Watch Demos <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition-all">
              <Database className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Integration
              </h3>
              <p className="text-gray-600 mb-4">
                API docs for Judiciary, NTSA integration
              </p>
              <a
                href="/integration"
                className="text-green-600 hover:text-green-700 inline-flex items-center gap-2"
              >
                View Docs <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section id="support" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact & Support
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We're here to help you succeed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/support"
              className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-8 hover:shadow-lg transition-all text-center"
            >
              <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tech Support
              </h3>
              <p className="text-gray-600">24/7 technical assistance</p>
            </Link>

            <Link
              href="/report-issue"
              className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-8 hover:shadow-lg transition-all text-center"
            >
              <FileText className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Report Issue
              </h3>
              <p className="text-gray-600">Submit bug reports or issues</p>
            </Link>

            <Link
              href="/feedback"
              className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-8 hover:shadow-lg transition-all text-center"
            >
              <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Feedback
              </h3>
              <p className="text-gray-600">Share your suggestions</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg border border-yellow-500/40">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Digital OB</h3>
                  <p className="text-xs text-gray-400">Kenya Police Service</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Modernizing law enforcement record-keeping across Kenya
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#about" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#structure" className="hover:text-white transition">
                    Structure
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#login" className="hover:text-white transition">
                    Login
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/faqs" className="hover:text-white transition">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="/tutorials" className="hover:text-white transition">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="/integration" className="hover:text-white transition">
                    Integration
                  </a>
                </li>
                <li>
                  <a href="/support" className="hover:text-white transition">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: support@digitalob.go.ke</li>
                <li>Hotline: 0800 123 456</li>
                <li>Vigilance House, Harambee Ave</li>
                <li>Nairobi, Kenya</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2026 Kenya Police Service. All rights reserved. | Version 2.0.1
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <a href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition">
                Terms of Service
              </a>
              <a href="/security" className="hover:text-white transition">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;