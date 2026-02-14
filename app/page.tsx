
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Layers, Smartphone, Globe, ShieldAlert, Target, Users, AlertTriangle, FileText, CheckCircle2, Server, Database } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { PlanViewer } from '../components/plan-viewer';
import { ProjectHistory } from '../components/history/ProjectHistory';
import { Plan } from '../types/plan';


import { usePlanStore } from '../store/usePlanStore';

export default function Home() {
  const {
    formData,
    setFormData,
    isLoading,
    generatedPlan,
    generatePlan,
    selectPlan,
    currentStep,
    setCurrentStep,
    resetForm,
    error
  } = usePlanStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generatePlan();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-50 selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 border border-zinc-200 dark:border-zinc-800 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-zinc-600 dark:text-zinc-300 mr-2">
              AI-Powered Implementation Planner
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white pb-2">
            Build It Right, <br /> First Time.
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <motion.div
            className="hidden lg:block lg:col-span-3 sticky top-8 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-12">
              <StepIndicator step={1} title="Feature Info" description="Define goals & constraints" active={currentStep === 1} completed={currentStep > 1} />
              <StepIndicator step={2} title="Review Plan" description="AI generated tasks" active={currentStep === 2} completed={currentStep > 2} />
              <StepIndicator step={3} title="Export" description="Sync to Jira or Markdown" active={currentStep === 3} completed={currentStep > 3} />
            </div>
          </motion.div>

          <motion.div
            className="col-span-1 lg:col-span-9"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatePresence mode="wait">
              {currentStep === 1 || !generatedPlan ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-white/20 ring-1 ring-zinc-900/5"
                >

                  <ProjectHistory onSelect={(item) => selectPlan(item._id)} />

                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800/50">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">New Feature Spec</h2>
                      <p className="text-sm text-zinc-500">Fill in the details below to generate your plan.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          name="featureName"
                          label="Feature Name"
                          placeholder="e.g. User Authentication"
                          value={formData.featureName}
                          onChange={handleChange}
                          required
                        />
                        <Select
                          name="type"
                          label="Platform Type"
                          options={[
                            { value: 'web', label: 'Web Application' },
                            { value: 'mobile', label: 'Mobile App' },
                            { value: 'internal', label: 'Internal Tool' },
                            { value: 'service', label: 'Backend Service' },
                          ]}
                          value={formData.type}
                          onChange={handleChange}
                        />
                      </div>

                      <Textarea
                        name="goal"
                        label="What is the goal?"
                        placeholder="e.g. Allow users to sign up via Email/Password and Google OAuth..."
                        value={formData.goal}
                        onChange={handleChange}
                        className="min-h-[100px]"
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          name="targetUsers"
                          label="Who is this for?"
                          placeholder="e.g. Admin users"
                          value={formData.targetUsers}
                          onChange={handleChange}
                        />
                        <Input
                          name="constraints"
                          label="Technical Constraints"
                          placeholder="e.g. Must use NextAuth"
                          value={formData.constraints}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Risks & Unknowns (Optional)
                          </label>
                        </div>
                        <Textarea
                          name="risks"
                          placeholder="e.g. 3rd party API rate limits..."
                          value={formData.risks}
                          onChange={handleChange}
                          className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-200"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end">
                      <Button
                        size="lg"
                        className="w-full md:w-auto text-base px-8 shadow-xl shadow-blue-500/20"
                        rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
                        isLoading={isLoading}
                        type="submit"
                      >
                        {isLoading ? 'Generating Plan...' : 'Generate Plan'}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <PlanViewer
                  key="viewer"
                  plan={generatedPlan}
                  onBack={resetForm}
                  onViewModeChange={(mode) => setCurrentStep(mode === 'kanban' ? 2 : 3)}
                />
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
}


function StepIndicator({ step, title, description, active, completed }: { step: number; title: string; description: string; active?: boolean; completed?: boolean }) {
  return (
    <div className={`relative transition-opacity duration-300 ${active || completed ? 'opacity-100' : 'opacity-40'}`}>
      <span className={`absolute -left-[29px] top-1 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white dark:ring-zinc-950 text-xs font-bold transition-colors
        ${completed ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
        {completed ? <CheckCircle2 className="w-3 h-3" /> : step}
      </span>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{title}</h3>
      <p className="text-sm text-zinc-500 mt-1">{description}</p>
    </div>
  );
}
