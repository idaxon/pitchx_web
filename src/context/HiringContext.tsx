import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  EnterpriseRole,
  EnterpriseUser,
  PipelineStage,
  PipelineTemplate,
  ATSApplication,
  WorkflowEvent,
  InterviewRecord,
  InterviewFeedback,
  HRInterviewFeedback,
  OfferRecord,
  HiringNotification,
} from '../types/hiring';
import {
  mockEnterpriseUsers,
  defaultPipelineTemplates,
  initialStagesForJobs,
  initialATSApplications,
  initialHiringNotifications,
} from '../data/mockHiringData';
import { workflowService } from '../services/workflowService';
import { interviewService } from '../services/interviewService';
import { offerService } from '../services/offerService';
import { pipelineService } from '../services/pipelineService';
import { applicationService } from '../services/applicationService';
import { notificationService } from '../services/notificationService';
import { isSupabaseConfigured } from '../lib/supabase';

interface ActionCounts {
  hrReviews: number;
  managerResponses: number;
  interviewsToday: number;
  offersPending: number;
  managerToReview: number;
  feedbackPending: number;
}

interface HiringContextType {
  // Roles & Users
  currentEnterpriseRole: EnterpriseRole;
  currentEnterpriseUser: EnterpriseUser;
  enterpriseUsers: EnterpriseUser[];
  switchEnterpriseRole: (role: EnterpriseRole) => void;
  selectEnterpriseUser: (userId: string) => void;

  // Team management
  addTeamMember: (member: Omit<EnterpriseUser, 'organization_id'>) => void;
  removeTeamMember: (userId: string) => void;

  // Applications & ATS State
  applications: ATSApplication[];
  selectedApplication: ATSApplication | null;
  setSelectedApplication: (app: ATSApplication | null) => void;
  selectedJobId: string;
  setSelectedJobId: (jobId: string) => void;

  // Pipelines & Stages
  jobStages: Record<string, PipelineStage[]>;
  pipelineTemplates: PipelineTemplate[];
  getStagesForJob: (jobId: string) => PipelineStage[];
  updateJobStages: (jobId: string, newStages: PipelineStage[]) => void;
  applyTemplateToJob: (jobId: string, templateId: string) => void;
  addStageToJob: (jobId: string, stage: Omit<PipelineStage, 'id' | 'job_id'>) => void;
  deleteStageFromJob: (jobId: string, stageId: string) => void;

  // Notifications
  notifications: HiringNotification[];
  unreadNotifsCount: number;
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;

  // Dynamic Calculated Action Counts
  actionCounts: ActionCounts;

  // Workflow Engine Actions
  sendToManager: (appId: string, managerId: string, note?: string) => void;
  approveByManager: (appId: string, note?: string) => void;
  returnToHr: (appId: string, reason: string, comment: string) => void;
  rejectCandidate: (appId: string, reason?: string, internalComment?: string) => void;
  scheduleInterview: (appId: string, interviewerId: string, timeSlot: string, meetingLink?: string) => void;
  submitInterviewFeedback: (appId: string, interviewId: string, feedback: InterviewFeedback) => void;
  completeHrInterview: (appId: string, feedback: HRInterviewFeedback) => void;
  generateAndSendOffer: (appId: string, offerData: Partial<OfferRecord>) => void;
  acceptOffer: (appId: string) => void;
  declineOffer: (appId: string, reason?: string) => void;
  moveCandidateToStage: (appId: string, targetStageId: string, comment?: string) => void;
  addWorkflowComment: (appId: string, comment: string, isInternal?: boolean) => void;
  resetToInitialDemoData: () => void;
}

const HiringContext = createContext<HiringContextType | undefined>(undefined);

const STORAGE_KEY_APPS = 'pitchx_ats_applications_v2';
const STORAGE_KEY_STAGES = 'pitchx_ats_stages_v2';
const STORAGE_KEY_NOTIFS = 'pitchx_ats_notifs_v2';
const STORAGE_KEY_ROLE = 'pitchx_ats_current_role_v2';

export const HiringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enterpriseUsers, setEnterpriseUsers] = useState<EnterpriseUser[]>(mockEnterpriseUsers);

  const [currentEnterpriseRole, setCurrentEnterpriseRole] = useState<EnterpriseRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLE);
      return (saved as EnterpriseRole) || 'HR';
    } catch {
      return 'HR';
    }
  });

  const [currentEnterpriseUser, setCurrentEnterpriseUser] = useState<EnterpriseUser>(() => {
    return (
      mockEnterpriseUsers.find((u) => u.role === currentEnterpriseRole) ||
      mockEnterpriseUsers[0]
    );
  });

  const [applications, setApplications] = useState<ATSApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return initialATSApplications;
  });

  const [jobStages, setJobStages] = useState<Record<string, PipelineStage[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STAGES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return initialStagesForJobs;
  });

  const [notifications, setNotifications] = useState<HiringNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return initialHiringNotifications;
  });

  const [selectedApplication, setSelectedApplication] = useState<ATSApplication | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>('rec-job-2');
  const [pipelineTemplates] = useState<PipelineTemplate[]>(defaultPipelineTemplates);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    } catch {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STAGES, JSON.stringify(jobStages));
    } catch {}
  }, [jobStages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, currentEnterpriseRole);
    } catch {}
  }, [currentEnterpriseRole]);

  // Keep user synchronized with role
  const switchEnterpriseRole = (role: EnterpriseRole) => {
    setCurrentEnterpriseRole(role);
    const matchedUser = enterpriseUsers.find((u) => u.role === role);
    if (matchedUser) {
      setCurrentEnterpriseUser(matchedUser);
    }
  };

  const selectEnterpriseUser = (userId: string) => {
    const user = enterpriseUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentEnterpriseUser(user);
      setCurrentEnterpriseRole(user.role);
    }
  };

  const addTeamMember = (member: Omit<EnterpriseUser, 'organization_id'>) => {
    const newMember: EnterpriseUser = {
      ...member,
      organization_id: 'org-stripe-pitchx',
    };
    setEnterpriseUsers((prev) => [...prev, newMember]);
  };

  const removeTeamMember = (userId: string) => {
    setEnterpriseUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const getStagesForJob = (jobId: string): PipelineStage[] => {
    if (jobStages[jobId]) return jobStages[jobId];
    // Fallback: copy template standard
    return defaultPipelineTemplates[0].stages.map((stg, idx) => ({
      ...stg,
      id: `stg-${jobId}-${idx + 1}`,
      job_id: jobId,
    }));
  };

  const updateJobStages = (jobId: string, newStages: PipelineStage[]) => {
    setJobStages((prev) => ({
      ...prev,
      [jobId]: newStages.map((stg, i) => ({ ...stg, position: i + 1 })),
    }));
  };

  const applyTemplateToJob = (jobId: string, templateId: string) => {
    const template = pipelineTemplates.find((t) => t.id === templateId) || pipelineTemplates[0];
    const newStages: PipelineStage[] = template.stages.map((stg, i) => ({
      ...stg,
      id: `stg-${jobId}-${Date.now()}-${i + 1}`,
      job_id: jobId,
      position: i + 1,
    }));
    updateJobStages(jobId, newStages);
  };

  const addStageToJob = (jobId: string, stageData: Omit<PipelineStage, 'id' | 'job_id'>) => {
    const currentStages = getStagesForJob(jobId);
    const newStage: PipelineStage = {
      ...stageData,
      id: `stg-${jobId}-${Date.now()}`,
      job_id: jobId,
      position: currentStages.length + 1,
    };
    updateJobStages(jobId, [...currentStages, newStage]);
  };

  const deleteStageFromJob = (jobId: string, stageId: string) => {
    const currentStages = getStagesForJob(jobId);
    const filtered = currentStages.filter((s) => s.id !== stageId);
    updateJobStages(jobId, filtered);
  };

  // Unread notifications for current role/user
  const unreadNotifsCount = notifications.filter(
    (n) => !n.read && (n.recipient_user_id === currentEnterpriseUser.id || n.recipient_role === currentEnterpriseRole)
  ).length;

  const markNotificationAsRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.recipient_user_id === currentEnterpriseUser.id || n.recipient_role === currentEnterpriseRole
          ? { ...n, read: true }
          : n
      )
    );
  };

  // Calculated action counts dynamically derived from workflow state
  const actionCounts: ActionCounts = {
    hrReviews: applications.filter(
      (a) => a.current_stage_name.toLowerCase().includes('hr') && (a.status === 'IN_REVIEW' || a.status === 'APPLIED')
    ).length,
    managerResponses: applications.filter((a) => a.status === 'RETURNED' || a.status === 'HR_INTERVIEW').length,
    interviewsToday: applications.filter(
      (a) => a.interviews && a.interviews.some((i) => i.status === 'SCHEDULED' && i.scheduled_at.toLowerCase().includes('today'))
    ).length,
    offersPending: applications.filter((a) => a.status === 'OFFER').length,
    managerToReview: applications.filter(
      (a) => a.current_stage_name.toLowerCase().includes('manager') && a.status === 'MANAGER_REVIEW'
    ).length,
    feedbackPending: applications.filter(
      (a) => a.status === 'INTERVIEW' && a.interviews.some((i) => i.status === 'SCHEDULED')
    ).length,
  };

  // Helper to add notification
  const addNotification = (
    recipientUserId: string,
    recipientRole: EnterpriseRole,
    title: string,
    message: string,
    appId?: string,
    jobId?: string,
    type: HiringNotification['type'] = 'GENERAL'
  ) => {
    const notif: HiringNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      recipient_user_id: recipientUserId,
      recipient_role: recipientRole,
      title,
      message,
      application_id: appId,
      job_id: jobId,
      created_at: 'Just now',
      read: false,
      type,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // ==========================================
  // WORKFLOW ENGINE ACTIONS
  // ==========================================

  // 1. HR -> Send to Manager
  const sendToManager = (appId: string, managerId: string, note?: string) => {
    const manager = enterpriseUsers.find((u) => u.id === managerId) || enterpriseUsers.find((u) => u.role === 'MANAGER') || enterpriseUsers[1];
    
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const stages = getStagesForJob(app.job_id);
        const managerStage = stages.find((s) => s.stage_type === 'MANAGER_REVIEW') || stages[1] || stages[0];

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          from_stage_id: app.current_stage_id,
          from_stage_name: app.current_stage_name,
          to_stage_id: managerStage.id,
          to_stage_name: managerStage.name,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          assigned_to_id: manager.id,
          assigned_to_name: manager.name,
          action: 'SENT_TO_MANAGER',
          comment: note || `Candidate ${app.candidate.name} forwarded to ${manager.name} for managerial assessment.`,
          is_internal_only: true,
          created_at: 'Just now',
        };

        const updated: ATSApplication = {
          ...app,
          current_stage_id: managerStage.id,
          current_stage_name: managerStage.name,
          current_owner_id: manager.id,
          current_owner_name: manager.name,
          current_owner_role: 'MANAGER',
          status: 'MANAGER_REVIEW',
          next_action: `Review candidate profile and assess project quality (${manager.name})`,
          updated_at: 'Just now',
          hr_notes: note ? `${app.hr_notes ? app.hr_notes + ' | ' : ''}${note}` : app.hr_notes,
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        return updated;
      })
    );

    addNotification(
      manager.id,
      'MANAGER',
      'New Candidate Assigned for Review',
      `${currentEnterpriseUser.name} sent candidate for your review. ${note ? `"${note}"` : ''}`,
      appId,
      undefined,
      'CANDIDATE_ASSIGNED'
    );
  };

  // 2. Manager -> Approve (Auto-advance to Next Configured Stage, e.g. Technical Interview)
  const approveByManager = (appId: string, note?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const stages = getStagesForJob(app.job_id);
        const currentIndex = stages.findIndex((s) => s.id === app.current_stage_id);
        const nextStage = stages[currentIndex + 1] || stages.find((s) => s.stage_type === 'TECHNICAL_INTERVIEW') || stages[stages.length - 1];

        // Assign interviewer or HR according to next stage configuration
        const assignedInterviewer = enterpriseUsers.find((u) => u.role === 'INTERVIEWER') || enterpriseUsers[2];
        const nextOwner = nextStage.stage_type === 'TECHNICAL_INTERVIEW'
          ? assignedInterviewer
          : (enterpriseUsers.find((u) => u.role === 'HR') || enterpriseUsers[0]);

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          from_stage_id: app.current_stage_id,
          from_stage_name: app.current_stage_name,
          to_stage_id: nextStage.id,
          to_stage_name: nextStage.name,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          assigned_to_id: nextOwner.id,
          assigned_to_name: nextOwner.name,
          action: 'MANAGER_APPROVED',
          comment: note || `Manager approved ${app.candidate.name}. Auto-routed to ${nextStage.name}.`,
          is_internal_only: true,
          created_at: 'Just now',
        };

        const scheduledSlot = 'Tomorrow at 10:00 AM IST';
        const newInterview: InterviewRecord = {
          id: `int-${Date.now()}`,
          application_id: app.id,
          job_id: app.job_id,
          candidate_id: app.candidate_id,
          candidate_name: app.candidate.name,
          stage_id: nextStage.id,
          stage_name: nextStage.name,
          interviewer_id: assignedInterviewer.id,
          interviewer_name: assignedInterviewer.name,
          interviewer_role: assignedInterviewer.designation,
          scheduled_at: 'Tomorrow',
          time_slot: scheduledSlot,
          meeting_link: 'https://meet.pitchx.dev/interview-live',
          status: 'SCHEDULED',
        };

        const updated: ATSApplication = {
          ...app,
          current_stage_id: nextStage.id,
          current_stage_name: nextStage.name,
          current_owner_id: nextOwner.id,
          current_owner_name: nextOwner.name,
          current_owner_role: nextOwner.role,
          status: nextStage.stage_type === 'TECHNICAL_INTERVIEW' ? 'INTERVIEW' : 'WAITING_FOR_ACTION',
          next_action: `Conduct ${nextStage.name} (${nextOwner.name})`,
          updated_at: 'Just now',
          manager_notes: note ? `${app.manager_notes ? app.manager_notes + ' | ' : ''}${note}` : app.manager_notes,
          interviews: [newInterview, ...(app.interviews || [])],
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        // Notify interviewer
        addNotification(
          assignedInterviewer.id,
          'INTERVIEWER',
          'Interview Assigned',
          `Manager approved ${app.candidate.name}. Technical interview scheduled for tomorrow at 10:00 AM.`,
          appId,
          app.job_id,
          'INTERVIEW_ASSIGNED'
        );

        // Notify HR
        const hrUser = enterpriseUsers.find((u) => u.role === 'HR') || enterpriseUsers[0];
        addNotification(
          hrUser.id,
          'HR',
          'Manager Approved Candidate',
          `${currentEnterpriseUser.name} approved ${app.candidate.name}. Moved to ${nextStage.name}.`,
          appId,
          app.job_id,
          'MANAGER_DECISION'
        );

        // Candidate safe notification
        addNotification(
          app.candidate_id,
          'CANDIDATE',
          'Interview Scheduled!',
          `Your technical interview with the engineering team has been scheduled for tomorrow at 10:00 AM IST.`,
          appId,
          app.job_id,
          'GENERAL'
        );

        return updated;
      })
    );
  };

  // 3. Manager -> Return to HR
  const returnToHr = (appId: string, reason: string, comment: string) => {
    const hrUser = enterpriseUsers.find((u) => u.role === 'HR') || enterpriseUsers[0];

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          from_stage_id: app.current_stage_id,
          from_stage_name: app.current_stage_name,
          to_stage_id: app.current_stage_id,
          to_stage_name: app.current_stage_name,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          assigned_to_id: hrUser.id,
          assigned_to_name: hrUser.name,
          action: 'RETURNED_TO_HR',
          reason,
          comment: comment || `Manager returned candidate to HR for clarification: ${reason}`,
          is_internal_only: true,
          created_at: 'Just now',
        };

        const updated: ATSApplication = {
          ...app,
          current_owner_id: hrUser.id,
          current_owner_name: hrUser.name,
          current_owner_role: 'HR',
          status: 'RETURNED',
          return_reason: reason,
          return_comment: comment,
          next_action: `HR Action Required: Resolve "${reason}" (${comment})`,
          updated_at: 'Just now',
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        return updated;
      })
    );

    addNotification(
      hrUser.id,
      'HR',
      'Candidate Returned by Manager',
      `${currentEnterpriseUser.name} returned candidate: "${reason} - ${comment}"`,
      appId,
      undefined,
      'RETURNED'
    );
  };

  // 4. Reject Candidate
  const rejectCandidate = (appId: string, reason?: string, internalComment?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          from_stage_id: app.current_stage_id,
          from_stage_name: app.current_stage_name,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          action: 'REJECTED',
          reason: reason || 'Not a mutual fit at this time',
          comment: internalComment || `Candidate archived by ${currentEnterpriseUser.name}.`,
          is_internal_only: true,
          created_at: 'Just now',
        };

        const updated: ATSApplication = {
          ...app,
          status: 'REJECTED',
          next_action: 'Application archived / rejected',
          updated_at: 'Just now',
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        return updated;
      })
    );
  };

  // 5. Schedule Interview
  const scheduleInterview = (appId: string, interviewerId: string, timeSlot: string, meetingLink?: string) => {
    const interviewer = enterpriseUsers.find((u) => u.id === interviewerId) || enterpriseUsers.find((u) => u.role === 'INTERVIEWER') || enterpriseUsers[2];

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const newInterview: InterviewRecord = {
          id: `int-${Date.now()}`,
          application_id: app.id,
          job_id: app.job_id,
          candidate_id: app.candidate_id,
          candidate_name: app.candidate.name,
          stage_id: app.current_stage_id,
          stage_name: app.current_stage_name,
          interviewer_id: interviewer.id,
          interviewer_name: interviewer.name,
          interviewer_role: interviewer.designation,
          scheduled_at: 'Today',
          time_slot: timeSlot,
          meeting_link: meetingLink || 'https://meet.pitchx.dev/live-panel',
          status: 'SCHEDULED',
        };

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          assigned_to_id: interviewer.id,
          assigned_to_name: interviewer.name,
          action: 'INTERVIEW_SCHEDULED',
          comment: `Interview scheduled with ${interviewer.name} (${timeSlot}).`,
          is_internal_only: false,
          created_at: 'Just now',
        };

        const updated: ATSApplication = {
          ...app,
          status: 'INTERVIEW',
          current_owner_id: interviewer.id,
          current_owner_name: interviewer.name,
          current_owner_role: 'INTERVIEWER',
          next_action: `Conduct interview (${timeSlot})`,
          interviews: [newInterview, ...(app.interviews || [])],
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        return updated;
      })
    );

    addNotification(
      interviewer.id,
      'INTERVIEWER',
      'Interview Scheduled',
      `New technical interview scheduled for ${timeSlot}.`,
      appId,
      undefined,
      'INTERVIEW_ASSIGNED'
    );
  };

  // 6. Technical Interviewer -> Submit Feedback
  const submitInterviewFeedback = (appId: string, interviewId: string, feedback: InterviewFeedback) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const hrUser = enterpriseUsers.find((u) => u.role === 'HR') || enterpriseUsers[0];
        const stages = getStagesForJob(app.job_id);
        const currentIndex = stages.findIndex((s) => s.id === app.current_stage_id);
        const hrStage = stages.find((s) => s.stage_type === 'HR_INTERVIEW') || stages[currentIndex + 1] || stages[stages.length - 2];

        const updatedInterviews = app.interviews.map((int) =>
          int.id === interviewId
            ? { ...int, status: 'COMPLETED' as const, feedback: { ...feedback, submitted_at: 'Just now' } }
            : int
        );

        const isHirable = feedback.recommendation === 'STRONG_HIRE' || feedback.recommendation === 'HIRE';
        const isAnotherRound = feedback.recommendation === 'ANOTHER_ROUND';

        let targetStageId = app.current_stage_id;
        let targetStageName = app.current_stage_name;
        let newStatus: ATSApplication['status'] = 'HR_INTERVIEW';
        let newNextAction = 'Conduct HR Interview & Cultural Alignment';

        if (isHirable && hrStage) {
          targetStageId = hrStage.id;
          targetStageName = hrStage.name;
          newStatus = 'HR_INTERVIEW';
          newNextAction = `HR Interview: Finalize package and alignment (${hrUser.name})`;
        } else if (isAnotherRound) {
          newStatus = 'WAITING_FOR_ACTION';
          newNextAction = 'Interviewer requested another evaluation round';
        } else {
          newStatus = 'REJECTED';
          newNextAction = 'Not recommended by technical panel';
        }

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          from_stage_id: app.current_stage_id,
          from_stage_name: app.current_stage_name,
          to_stage_id: targetStageId,
          to_stage_name: targetStageName,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          assigned_to_id: hrUser.id,
          assigned_to_name: hrUser.name,
          action: 'FEEDBACK_SUBMITTED',
          comment: `Technical Feedback submitted: ${feedback.recommendation} (Score: Tech ${feedback.tech_knowledge_score}/5, Problem Solving ${feedback.problem_solving_score}/5, Comm ${feedback.communication_score}/5). Notes: ${feedback.notes}`,
          is_internal_only: true,
          created_at: 'Just now',
        };

        const updated: ATSApplication = {
          ...app,
          current_stage_id: targetStageId,
          current_stage_name: targetStageName,
          current_owner_id: hrUser.id,
          current_owner_name: hrUser.name,
          current_owner_role: 'HR',
          status: newStatus,
          next_action: newNextAction,
          updated_at: 'Just now',
          interviews: updatedInterviews,
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        // Notify HR
        addNotification(
          hrUser.id,
          'HR',
          `Technical Feedback: ${feedback.recommendation}`,
          `${currentEnterpriseUser.name} submitted score for ${app.candidate.name}: ${feedback.recommendation}. Ready for HR round.`,
          appId,
          app.job_id,
          'FEEDBACK_SUBMITTED'
        );

        return updated;
      })
    );
  };

  // 7. HR -> Complete HR Interview & Advance to Offer
  const completeHrInterview = (appId: string, feedback: HRInterviewFeedback) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const stages = getStagesForJob(app.job_id);
        const offerStage = stages.find((s) => s.stage_type === 'OFFER') || stages[stages.length - 2];

        const isApproved = feedback.decision === 'APPROVE_FOR_OFFER';

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          from_stage_id: app.current_stage_id,
          from_stage_name: app.current_stage_name,
          to_stage_id: isApproved && offerStage ? offerStage.id : app.current_stage_id,
          to_stage_name: isApproved && offerStage ? offerStage.name : app.current_stage_name,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          action: isApproved ? 'HR_APPROVED_FOR_OFFER' : 'HR_REJECTED',
          comment: `HR Interview completed. Decision: ${feedback.decision}. Expected CTC: ${feedback.expected_salary}, Notice: ${feedback.notice_period}, Culture Fit: ${feedback.culture_fit_score}/5. Notes: ${feedback.notes}`,
          is_internal_only: true,
          created_at: 'Just now',
        };

        const updated: ATSApplication = {
          ...app,
          current_stage_id: isApproved && offerStage ? offerStage.id : app.current_stage_id,
          current_stage_name: isApproved && offerStage ? offerStage.name : app.current_stage_name,
          status: isApproved ? 'OFFER' : 'REJECTED',
          next_action: isApproved ? 'Generate & Send Official Offer Letter' : 'Candidate archived',
          updated_at: 'Just now',
          hr_interview: { ...feedback, completed_at: 'Just now' },
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        return updated;
      })
    );
  };

  // 8. HR -> Generate and Send Offer
  const generateAndSendOffer = (appId: string, offerData: Partial<OfferRecord>) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const newOffer: OfferRecord = {
          id: `off-${Date.now()}`,
          application_id: app.id,
          candidate_name: app.candidate.name,
          role_title: app.job_title,
          salary: offerData.salary || '₹48,00,000 / year + RSUs',
          joining_date: offerData.joining_date || '1st Next Month',
          location: offerData.location || app.candidate.location,
          perks: offerData.perks || ['Health Insurance', 'Home Office Stipend', 'Learning Budget ₹1.5L', 'Performance Bonus'],
          equity: offerData.equity || '$30,000 RSUs (4-year vesting)',
          notes: offerData.notes || 'Formal employment offer letter extended.',
          status: 'SENT',
          created_at: 'Just now',
          updated_at: 'Just now',
        };

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          from_stage_id: app.current_stage_id,
          from_stage_name: app.current_stage_name,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          action: 'OFFER_SENT',
          comment: `Formal offer of ${newOffer.salary} sent to ${app.candidate.name}.`,
          is_internal_only: false,
          created_at: 'Just now',
        };

        const updated: ATSApplication = {
          ...app,
          status: 'OFFER',
          next_action: `Awaiting candidate offer acceptance (${newOffer.salary})`,
          updated_at: 'Just now',
          offer: newOffer,
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        // Notify Candidate
        addNotification(
          app.candidate_id,
          'CANDIDATE',
          'Congratulations! You received an Offer 🎉',
          `PitchX Talent extended an offer for ${app.job_title} (${newOffer.salary}). Click to view details and accept.`,
          appId,
          app.job_id,
          'OFFER_UPDATE'
        );

        return updated;
      })
    );
  };

  // 9. Candidate -> Accept Offer -> Automatically Hires Candidate
  const acceptOffer = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const stages = getStagesForJob(app.job_id);
        const hiredStage = stages.find((s) => s.stage_type === 'HIRED') || stages[stages.length - 1];

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          from_stage_id: app.current_stage_id,
          from_stage_name: app.current_stage_name,
          to_stage_id: hiredStage.id,
          to_stage_name: hiredStage.name,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          action: 'OFFER_ACCEPTED',
          comment: `Candidate ${app.candidate.name} officially accepted the offer! Transferred to Hired state.`,
          is_internal_only: false,
          created_at: 'Just now',
        };

        const updatedOffer: OfferRecord | undefined = app.offer ? {
          ...app.offer,
          status: 'ACCEPTED',
          updated_at: 'Just now',
        } : undefined;

        const updated: ATSApplication = {
          ...app,
          current_stage_id: hiredStage.id,
          current_stage_name: hiredStage.name,
          current_owner_id: 'usr-ananya-hr',
          current_owner_name: 'System / HR Onboarding',
          current_owner_role: 'HR',
          status: 'HIRED',
          next_action: 'Candidate Hired! Welcome to the team.',
          updated_at: 'Just now',
          offer: updatedOffer,
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        // Notify HR & Manager
        const hrUser = enterpriseUsers.find((u) => u.role === 'HR') || enterpriseUsers[0];
        const managerUser = enterpriseUsers.find((u) => u.role === 'MANAGER') || enterpriseUsers[1];

        addNotification(
          hrUser.id,
          'HR',
          'Offer Accepted! Candidate Hired 🎉',
          `${app.candidate.name} has accepted the offer for ${app.job_title}. Start onboarding!`,
          appId,
          app.job_id,
          'OFFER_UPDATE'
        );

        addNotification(
          managerUser.id,
          'MANAGER',
          'New Team Member Hired! 🚀',
          `${app.candidate.name} signed the offer for ${app.job_title} and is now HIRED!`,
          appId,
          app.job_id,
          'OFFER_UPDATE'
        );

        return updated;
      })
    );
  };

  // 10. Candidate -> Decline Offer
  const declineOffer = (appId: string, reason?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          action: 'OFFER_DECLINED',
          comment: `Candidate declined offer. Reason: ${reason || 'Personal preference / competing offer'}.`,
          is_internal_only: false,
          created_at: 'Just now',
        };

        const updatedOffer: OfferRecord | undefined = app.offer ? {
          ...app.offer,
          status: 'DECLINED',
          updated_at: 'Just now',
        } : undefined;

        const updated: ATSApplication = {
          ...app,
          status: 'WITHDRAWN',
          next_action: 'Offer declined by candidate',
          updated_at: 'Just now',
          offer: updatedOffer,
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        const hrUser = enterpriseUsers.find((u) => u.role === 'HR') || enterpriseUsers[0];
        addNotification(
          hrUser.id,
          'HR',
          'Offer Declined',
          `${app.candidate.name} declined the offer: "${reason || 'No reason provided'}"`,
          appId,
          app.job_id,
          'OFFER_UPDATE'
        );

        return updated;
      })
    );
  };

  // 11. Move Candidate to Any Configured Stage (Drag & Drop / Direct Trigger)
  const moveCandidateToStage = (appId: string, targetStageId: string, comment?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const stages = getStagesForJob(app.job_id);
        const targetStage = stages.find((s) => s.id === targetStageId);
        if (!targetStage) return app;

        let newStatus: ATSApplication['status'] = 'IN_REVIEW';
        if (targetStage.stage_type === 'MANAGER_REVIEW') newStatus = 'MANAGER_REVIEW';
        else if (targetStage.stage_type === 'TECHNICAL_INTERVIEW') newStatus = 'INTERVIEW';
        else if (targetStage.stage_type === 'HR_INTERVIEW') newStatus = 'HR_INTERVIEW';
        else if (targetStage.stage_type === 'OFFER') newStatus = 'OFFER';
        else if (targetStage.stage_type === 'HIRED') newStatus = 'HIRED';

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          from_stage_id: app.current_stage_id,
          from_stage_name: app.current_stage_name,
          to_stage_id: targetStage.id,
          to_stage_name: targetStage.name,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          action: 'STAGE_MOVED',
          comment: comment || `Moved stage to ${targetStage.name} by ${currentEnterpriseUser.name}.`,
          is_internal_only: true,
          created_at: 'Just now',
        };

        const updated: ATSApplication = {
          ...app,
          current_stage_id: targetStage.id,
          current_stage_name: targetStage.name,
          status: newStatus,
          next_action: `Progress in ${targetStage.name}`,
          updated_at: 'Just now',
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        return updated;
      })
    );
  };

  // 12. Add Workflow Note
  const addWorkflowComment = (appId: string, comment: string, isInternal = true) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const newEvent: WorkflowEvent = {
          id: `wf-${Date.now()}`,
          application_id: app.id,
          performed_by_id: currentEnterpriseUser.id,
          performed_by_name: currentEnterpriseUser.name,
          performed_by_role: currentEnterpriseUser.role,
          action: 'NOTE_ADDED',
          comment,
          is_internal_only: isInternal,
          created_at: 'Just now',
        };

        const updated: ATSApplication = {
          ...app,
          workflow_history: [newEvent, ...app.workflow_history],
        };

        if (selectedApplication?.id === appId) {
          setSelectedApplication(updated);
        }

        return updated;
      })
    );
  };

  // Reset to demo data
  const resetToInitialDemoData = () => {
    setApplications(initialATSApplications);
    setJobStages(initialStagesForJobs);
    setNotifications(initialHiringNotifications);
    localStorage.removeItem(STORAGE_KEY_APPS);
    localStorage.removeItem(STORAGE_KEY_STAGES);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
  };

  return (
    <HiringContext.Provider
      value={{
        currentEnterpriseRole,
        currentEnterpriseUser,
        enterpriseUsers,
        switchEnterpriseRole,
        selectEnterpriseUser,
        addTeamMember,
        removeTeamMember,
        applications,
        selectedApplication,
        setSelectedApplication,
        selectedJobId,
        setSelectedJobId,
        jobStages,
        pipelineTemplates,
        getStagesForJob,
        updateJobStages,
        applyTemplateToJob,
        addStageToJob,
        deleteStageFromJob,
        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        actionCounts,
        sendToManager,
        approveByManager,
        returnToHr,
        rejectCandidate,
        scheduleInterview,
        submitInterviewFeedback,
        completeHrInterview,
        generateAndSendOffer,
        acceptOffer,
        declineOffer,
        moveCandidateToStage,
        addWorkflowComment,
        resetToInitialDemoData,
      }}
    >
      {children}
    </HiringContext.Provider>
  );
};

export const useHiring = () => {
  const context = useContext(HiringContext);
  if (!context) {
    throw new Error('useHiring must be used within a HiringProvider');
  }
  return context;
};
