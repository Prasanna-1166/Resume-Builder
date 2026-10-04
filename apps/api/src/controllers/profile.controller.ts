import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    let profile = await prisma.userProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      profile = await prisma.userProfile.create({
        data: {
          userId: req.user.id,
          personalInfo: {
            fullName: user?.name || req.user.name || '',
            email: user?.email || req.user.email || ''
          }
        }
      });
    }

    res.json({ success: true, profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const {
      personalInfo,
      summary,
      skills,
      experience,
      education,
      projects,
      certifications,
      achievements,
      publications,
      research,
      conferences,
      references,
      activities,
      languages,
      customSections
    } = req.body;

    const profileData: any = {};
    if (personalInfo !== undefined) profileData.personalInfo = personalInfo;
    if (summary !== undefined) profileData.summary = summary;
    if (skills !== undefined) profileData.skills = skills;
    if (experience !== undefined) profileData.experience = experience;
    if (education !== undefined) profileData.education = education;
    if (projects !== undefined) profileData.projects = projects;
    if (certifications !== undefined) profileData.certifications = certifications;
    if (achievements !== undefined) profileData.achievements = achievements;
    if (publications !== undefined) profileData.publications = publications;
    if (research !== undefined) profileData.research = research;
    if (conferences !== undefined) profileData.conferences = conferences;
    if (references !== undefined) profileData.references = references;
    if (activities !== undefined) profileData.activities = activities;
    if (languages !== undefined) profileData.languages = languages;
    if (customSections !== undefined) profileData.customSections = customSections;

    const profile = await prisma.userProfile.upsert({
      where: { userId: req.user.id },
      update: profileData,
      create: {
        userId: req.user.id,
        ...profileData
      }
    });

    res.json({ success: true, profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update user profile.' });
  }
}
