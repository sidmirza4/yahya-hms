"use client";

import Link from 'next/link';
import { Button } from "@src/components/ui/button";
import { useSession } from "next-auth/react";


export default function Home() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-400 to-blue-300 text-white py-20 px-4 overflow-hidden">
        {/* Animated gradient glass overlay */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s'}}/>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl animate-pulse" style={{animationDuration: '8s'}}/>
          <div className="absolute top-1/3 left-2/3 w-40 h-40 bg-blue-300/30 rounded-full blur-2xl animate-pulse" style={{animationDuration: '7s'}}/>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight flex items-center gap-2">
                Welcome to Yahya Hospital
              </h1>
              <p className="text-xl opacity-90 flex items-center gap-2">
               Comprehensive care, modern technology, compassionate staff.
              </p>
              <div className="flex flex-wrap gap-4">
                {!isAuthenticated ? (
                  <>
                    <Link href="/login">
                      <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="inline-block">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.75A2.75 2.75 0 0 0 13 3H7A2.75 2.75 0 0 0 4.25 5.75v12.5A2.75 2.75 0 0 0 7 21h6a2.75 2.75 0 0 0 2.75-2.75V15" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12h-9m0 0 3.5 3.5M9 12l3.5-3.5" />
                        </svg>
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="lg" variant="outline" className='bg-none text-primary flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="inline-block">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Register
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard">
                    <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="inline-block">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Go to Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="relative w-full max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Modern hospital exterior"
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover border-4 border-white animate-fade-in"
                  style={{ minHeight: '18rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        {/* Floating medical icons */}
        <svg className="absolute left-10 top-10 w-12 h-12 opacity-10 animate-float" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m4-4H8m13 0A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" /></svg>
        <svg className="absolute right-16 top-24 w-10 h-10 opacity-10 text-blue-400 animate-float-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21C7.029 21 2.5 16.971 2.5 12S7.029 3 12 3s9.5 4.029 9.5 9-4.529 9-9.5 9z" /></svg>
        <svg className="absolute left-1/2 bottom-8 w-14 h-14 opacity-10 text-blue-200 animate-float-fast" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Patient Management</h3>
              <p className="text-gray-600">Register patients, manage their records, and track their appointments history.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Appointment Scheduling</h3>
              <p className="text-gray-600">Book, reschedule, and manage appointments with an intuitive interface.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Doctor Dashboard</h3>
              <p className="text-gray-600">Doctors can manage their schedules, view patient history, and handle appointments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Get in touch with us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm0 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm8-12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zm0 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            {/* Email Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4-4-4 4m8 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0l-4 4-4-4" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">contact@yahya-hospital.com</p>
            </div>
            {/* Address Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243A8 8 0 1117.657 16.657z" /></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <p className="text-gray-600">123 Wellness Ave, Health City, USA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M3 21h18M9 10h6M12 7v6" />
              </svg>
              <h3 className="text-xl font-bold text-blue-200">Yahya Hospital</h3>
              <p className="text-gray-400 ml-2">Streamlining healthcare management</p>
            </div>
            <div className="flex space-x-4">
              {/* <Link href="/login" className="hover:text-primary transition-colors">Login</Link> */}
              {/* <Link href="/register" className="hover:text-primary transition-colors">Register</Link> */}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Yahya Hospital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
